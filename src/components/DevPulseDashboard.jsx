/**
 * DevPulse Dashboard – main container
 *
 * Responsibilities:
 * - Fetch all APIs on mount (and on Refresh)
 * - Store raw data in useState
 * - Run processors and pass results to panels as props
 * - Switch tabs with activeTab state
 *
 * Does NOT render charts/lists directly – panels handle UI.
 */

import { useState, useEffect } from 'react';

import { fetchUsers } from '../api/fetchUsers';
import { fetchPosts } from '../api/fetchPosts';
import { fetchTodos } from '../api/fetchTodos';
import { fetchTrivia } from '../api/fetchTrivia';
import { fetchCountries } from '../api/fetchCountries';

import { userStats } from '../modules/userStats';
import { postAnalysis } from '../modules/postAnalysis';
import { productivityTracker } from '../modules/productivityTracker';
import { triviaScorer } from '../modules/triviaScorer';
import { countryLookup } from '../modules/countryLookup';

import OverviewPanel from './panels/OverviewPanel';
import UsersPanel from './panels/UsersPanel';
import PostsPanel from './panels/PostsPanel';
import ProductivityPanel from './panels/ProductivityPanel';
import TriviaPanel from './panels/TriviaPanel';
import CountriesPanel from './panels/CountriesPanel';

import '../styles/shared.css';
import '../styles/dashboard.css';
import '../styles/panels.css';

const TABS = [
  'Overview',
  'Users',
  'Posts',
  'Productivity',
  'Trivia',
  'Countries',
];

const DATA_KEYS = ['users', 'posts', 'todos', 'trivia', 'countries'];

function buildPanelData(users, posts, todos, trivia, countries, errors) {
  const overviewData =
    users && posts && todos && countries
      ? {
          totalUsers: userStats(users).totalUsers,
          totalPosts: postAnalysis(posts).totalPosts,
          totalTodos: todos.length,
          totalCountries: countryLookup(countries).totalCountries,
        }
      : null;

  const processedPostsData = posts ? postAnalysis(posts) : null;

  const productivityData =
    users && todos ? productivityTracker(users, todos) : null;

  let triviaData = null;

  if (trivia) {
    triviaData = triviaScorer(trivia);
  } else if (errors.trivia) {
    triviaData = {
      error: errors.trivia,
    };
  }

  const countriesData = countries
    ? {
        ...countryLookup(countries),
        countries,
      }
    : null;

  return {
    overviewData,
    processedPostsData,
    productivityData,
    triviaData,
    countriesData,
  };
}

function DevPulseDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({
    users: null,
    posts: null,
    todos: null,
    trivia: null,
    countries: null,
  });

  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState(null);
  const [todos, setTodos] = useState(null);
  const [trivia, setTrivia] = useState(null);
  const [countries, setCountries] = useState(null);

  const setters = [
    setUsers,
    setPosts,
    setTodos,
    setTrivia,
    setCountries,
  ];

  async function fetchAllData() {
    setLoading(true);

    const results = await Promise.allSettled([
      fetchUsers(),
      fetchPosts(),
      fetchTodos(),
      fetchTrivia(),
      fetchCountries(),
    ]);

    const nextErrors = {
      users: null,
      posts: null,
      todos: null,
      trivia: null,
      countries: null,
    };

    for (let i = 0; i < results.length; i++) {
      const key = DATA_KEYS[i];

      if (results[i].status === 'fulfilled') {
        setters[i](results[i].value);
      } else {
        const message =
          results[i].reason?.message || 'Request failed';

        nextErrors[key] = message;
      }
    }

    setErrors(nextErrors);
    setLoading(false);
  }

  useEffect(() => {
    fetchAllData();
  }, []);

  const panelData = buildPanelData(
    users,
    posts,
    todos,
    trivia,
    countries,
    errors,
  );

  const errorList = [];

  for (let i = 0; i < DATA_KEYS.length; i++) {
    const key = DATA_KEYS[i];

    if (errors[key]) {
      errorList.push({
        key,
        message: errors[key],
      });
    }
  }

  function renderActivePanel() {
    if (activeTab === 'Overview') {
      return <OverviewPanel data={panelData.overviewData} />;
    }

    if (activeTab === 'Users') {
      return <UsersPanel users={users} />;
    }

    if (activeTab === 'Posts') {
      return (
        <PostsPanel
          processedPostsData={panelData.processedPostsData}
        />
      );
    }

    if (activeTab === 'Productivity') {
      return (
        <ProductivityPanel
          productivityData={panelData.productivityData}
        />
      );
    }

    if (activeTab === 'Trivia') {
      return (
        <TriviaPanel
          triviaData={panelData.triviaData}
        />
      );
    }

    if (activeTab === 'Countries') {
      return (
        <CountriesPanel
          countriesData={panelData.countriesData}
        />
      );
    }

    return null;
  }

  return (
    <div className="devpulse-dashboard">
      <header className="devpulse-header">
        <h1>DevPulse Dashboard</h1>

        <button
          type="button"
          className="devpulse-refresh-btn"
          onClick={fetchAllData}
          disabled={loading}
        >
          Refresh
        </button>
      </header>

      {loading && (
        <p className="devpulse-loading">
          Loading dashboard data...
        </p>
      )}

      {!loading && errorList.length > 0 && (
        <div className="devpulse-errors">
          <h3>Some data could not be loaded</h3>

          <ul>
            {errorList.map((item) => (
              <li key={item.key}>
                <strong>{item.key}:</strong>{' '}
                {item.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <nav className="devpulse-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={
              activeTab === tab
                ? 'devpulse-tab-btn active'
                : 'devpulse-tab-btn'
            }
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {!loading && (
        <div className="devpulse-panel-content">
          {renderActivePanel()}
        </div>
      )}
    </div>
  );
}

export default DevPulseDashboard;
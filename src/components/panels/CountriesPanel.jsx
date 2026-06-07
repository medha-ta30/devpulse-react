import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import SectionTitle from '../shared/SectionTitle';

function formatPopulation(number) {
  return number.toLocaleString();
}

function CountriesPanel({ countriesData }) {
  const [search, setSearch] = useState('');

  const allCountries = countriesData?.countries;
  const top10 = countriesData?.top10CountriesByPopulation;

  if (!allCountries || allCountries.length === 0) {
    return (
      <div className="countries-panel">
        <p>No countries data to display.</p>
      </div>
    );
  }

  const filteredCountries = [];
  const searchText = search.trim().toLowerCase();

  for (let i = 0; i < allCountries.length; i++) {
    const country = allCountries[i];
    const countryName = country.name.common.toLowerCase();
    if (searchText === '' || countryName.includes(searchText)) {
      filteredCountries.push(country);
    }
  }

  return (
    <div className="countries-panel">
      <SectionTitle>Countries ({filteredCountries.length} results)</SectionTitle>

      <input
        type="text"
        className="countries-search"
        placeholder="Search by country name..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {top10 && top10.length > 0 && (
        <>
          <SectionTitle>Top 10 by Population</SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top10} margin={{ top: 8, right: 16, left: 8, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={70} />
              <YAxis tickFormatter={formatPopulation} />
              <Tooltip formatter={(value) => [formatPopulation(value), 'Population']} />
              <Bar dataKey="population" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {filteredCountries.length === 0 ? (
        <p>No countries match your search.</p>
      ) : (
        <div className="countries-grid">
          {filteredCountries.map((country) => (
            <article key={country.name.common} className="country-card">
              {country.flags?.png && (
                <img src={country.flags.png} alt="" className="country-card-flag" />
              )}
              <h4>{country.name.common}</h4>
              <p>Population: {formatPopulation(country.population)}</p>
              <p>Region: {country.region}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default CountriesPanel;
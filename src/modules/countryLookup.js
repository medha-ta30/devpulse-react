/**
 * Countries processor
 * Summarises country list for Overview and top-10 chart.
 * Raw country objects are still passed to CountriesPanel for search/flags.
 */

function getTotalCountries(countries) {
  return countries.length;
}

function sortByPopulationDescending(countries) {
  return [...countries].sort((a, b) => b.population - a.population);
}

function getTop10CountriesByPopulation(countries) {
  return sortByPopulationDescending(countries)
    .slice(0, 10)
    .map(country => ({
      name: country.name.common,
      population: country.population,
    }));
}

export function countryLookup(countries) {
  const totalCountries = getTotalCountries(countries);
  const top10CountriesByPopulation = getTop10CountriesByPopulation(countries);

  return {
    totalCountries,
    top10CountriesByPopulation,
  };
}
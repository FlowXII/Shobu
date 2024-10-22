import React from 'react';
import { Input, Select, Option, Button } from '@material-tailwind/react';

const TournamentFilterForm = ({ cCode, setCCode, perPage, setPerPage, videogameId, setVideogameId, handleFormSubmit, loading, videogameOptions }) => {
  return (
    <form onSubmit={handleFormSubmit} className="mb-6">
      <div className="flex flex-col gap-4">
        <Input
          label="Country Code"
          value={cCode}
          onChange={(e) => setCCode(e.target.value)}
          color="red"
          className="text-white"
        />
        <Input
          label="Maximum Displayed"
          type="number"
          value={perPage}
          onChange={(e) => setPerPage(e.target.value)}
          color="red"
          className="text-white"
        />
        <Select
          label="Select Game"
          value={videogameId}
          onChange={(value) => setVideogameId(value || "")}
          color="red"
          className="text-white"
          menuProps={{
            className: "bg-gray-800 border border-gray-700"
          }}
        >
          {videogameOptions.map((option) => (
            <Option key={option.id} value={option.id} className="text-white hover:bg-gray-700">
              {option.name}
            </Option>
          ))}
        </Select>
        <Button type="submit" color="red" ripple={true} disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default TournamentFilterForm;

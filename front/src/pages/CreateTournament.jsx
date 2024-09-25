import React, { useState } from 'react';
import { Input, Textarea, Button } from "@material-tailwind/react";

// Main component for the tournament creation form
const TournamentCreationForm = () => {
  // State to store form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  // Handler for input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to a backend API
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-r from-blue-900 via-purple-900 to-red-900">
      <div className="bg-black bg-opacity-50 p-10 rounded-lg text-center w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-white">Create Tournament</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tournament Name Input */}
          <div className="flex flex-col">
            <Input
              type="text"
              label="Tournament Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="text-white"
              labelProps={{
                className: "text-gray-300"
              }}
            />
          </div>

          {/* Tournament Description Textarea */}
          <div className="flex flex-col">
            <Textarea
              label="Tournament Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="text-white h-32"
              labelProps={{
                className: "text-gray-300"
              }}
            />
          </div>

          {/* Start Date Input */}
          <div className="flex flex-col">
            <Input
              type="date"
              label="Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="text-white"
              labelProps={{
                className: "text-gray-300"
              }}
            />
          </div>

          {/* End Date Input */}
          <div className="flex flex-col">
            <Input
              type="date"
              label="End Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="text-white"
              labelProps={{
                className: "text-gray-300"
              }}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white w-full"
          >
            Create Tournament
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TournamentCreationForm;

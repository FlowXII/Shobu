import React from 'react';
import { 
  Card, 
  CardBody, 
  Typography, 
  Input, 
  Textarea,
  Button 
} from "@material-tailwind/react";

const TournamentSettings = ({ tournament, onUpdate, formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  return (
    <form onSubmit={onUpdate} className="space-y-6">
      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody className="space-y-4">
          <Typography variant="h6">Basic Information</Typography>
          
          <Input
            label="Tournament Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
          />
          
          <Textarea
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              label="Start Date"
              name="startAt"
              value={formData.startAt?.split('.')[0] || ''}
              onChange={handleChange}
            />
            
            <Input
              type="datetime-local"
              label="End Date"
              name="endAt"
              value={formData.endAt?.split('.')[0] || ''}
              onChange={handleChange}
            />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody className="space-y-4">
          <Typography variant="h6">Location</Typography>
          
          <Input
            label="Venue Address"
            name="venueAddress"
            value={formData.location?.venueAddress || ''}
            onChange={handleChange}
          />
          
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.location?.city || ''}
              onChange={handleChange}
            />
            
            <Input
              label="State"
              name="state"
              value={formData.location?.state || ''}
              onChange={handleChange}
            />
            
            <Input
              label="Country"
              name="country"
              value={formData.location?.country || ''}
              onChange={handleChange}
            />
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};

export default TournamentSettings; 
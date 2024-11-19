import React, { useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Typography, 
  Input, 
  Textarea,
  Button 
} from "@material-tailwind/react";

const TournamentSettingsTO = ({ tournament, onUpdate, formData, setFormData }) => {
  // Pre-fill form data when tournament data is available
  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name || '',
        description: tournament.description || '',
        startAt: tournament.startAt ? new Date(tournament.startAt).toISOString().split('.')[0] : '',
        endAt: tournament.endAt ? new Date(tournament.endAt).toISOString().split('.')[0] : '',
        location: {
          venueAddress: tournament.location?.venueAddress || '',
          city: tournament.location?.city || '',
          state: tournament.location?.state || '',
          country: tournament.location?.country || ''
        }
      });
    }
  }, [tournament]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested location fields
    if (['venueAddress', 'city', 'state', 'country'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={onUpdate} className="space-y-6">
      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Typography variant="h6" className="text-blue-400">Basic Information</Typography>
            {tournament && (
              <Typography variant="small" className="text-gray-400">
                Last updated: {new Date(tournament.updatedAt).toLocaleDateString()}
              </Typography>
            )}
          </div>
          
          <Input
            label="Tournament Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="!text-white"
            labelProps={{
              className: "!text-gray-400"
            }}
            required
          />
          
          <Textarea
            label="Description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="!text-white"
            labelProps={{
              className: "!text-gray-400"
            }}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              label="Start Date"
              name="startAt"
              value={formData.startAt || ''}
              onChange={handleChange}
              className="!text-white"
              labelProps={{
                className: "!text-gray-400"
              }}
              required
            />
            
            <Input
              type="datetime-local"
              label="End Date"
              name="endAt"
              value={formData.endAt || ''}
              onChange={handleChange}
              className="!text-white"
              labelProps={{
                className: "!text-gray-400"
              }}
            />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gray-800/50 border border-white/10">
        <CardBody className="space-y-4">
          <Typography variant="h6" className="text-blue-400">Location</Typography>
          
          <Input
            label="Venue Address"
            name="venueAddress"
            value={formData.location?.venueAddress || ''}
            onChange={handleChange}
            className="!text-white"
            labelProps={{
              className: "!text-gray-400"
            }}
          />
          
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.location?.city || ''}
              onChange={handleChange}
              className="!text-white"
              labelProps={{
                className: "!text-gray-400"
              }}
            />
            
            <Input
              label="State"
              name="state"
              value={formData.location?.state || ''}
              onChange={handleChange}
              className="!text-white"
              labelProps={{
                className: "!text-gray-400"
              }}
            />
            
            <Input
              label="Country"
              name="country"
              value={formData.location?.country || ''}
              onChange={handleChange}
              className="!text-white"
              labelProps={{
                className: "!text-gray-400"
              }}
            />
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="text" 
          color="gray"
          onClick={() => setFormData({
            name: tournament.name || '',
            description: tournament.description || '',
            startAt: tournament.startAt ? new Date(tournament.startAt).toISOString().split('.')[0] : '',
            endAt: tournament.endAt ? new Date(tournament.endAt).toISOString().split('.')[0] : '',
            location: {
              venueAddress: tournament.location?.venueAddress || '',
              city: tournament.location?.city || '',
              state: tournament.location?.state || '',
              country: tournament.location?.country || ''
            }
          })}
        >
          Reset
        </Button>
        <Button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-600"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default TournamentSettingsTO; 
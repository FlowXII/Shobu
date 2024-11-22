import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
  Select,
  Option,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { Trophy, MapPin, Calendar, Users, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

const CreateTournament = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(1); // Track which accordion is open
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    startAt: '',
    endAt: '',
    type: 'SINGLE_ELIMINATION',
    location: {
      city: '',
      state: '',
      country: '',
      venueAddress: ''
    },
    registrationStartAt: '',
    registrationEndAt: '',
    maxAttendees: '',
    status: 'DRAFT',
    events: [],
    numAttendees: 0,
    images: []
  });

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: generateSlug(value)
      }));
      return;
    }

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload to a server/CDN here
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url: imageUrl, type: 'banner' }]
      }));
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Tournament name is required');
    if (!formData.startAt) errors.push('Start date is required');
    
    // Validate dates
    if (formData.endAt && new Date(formData.endAt) < new Date(formData.startAt)) {
      errors.push('End date cannot be before start date');
    }

    // Validate registration period
    if (formData.registrationStartAt && formData.registrationEndAt) {
      const regStart = new Date(formData.registrationStartAt);
      const regEnd = new Date(formData.registrationEndAt);
      const tournamentStart = new Date(formData.startAt);

      if (regEnd < regStart) {
        errors.push('Registration end date cannot be before registration start date');
      }
      if (regEnd > tournamentStart) {
        errors.push('Registration must end before tournament starts');
      }
    }

    // Validate attendees
    if (formData.maxAttendees && formData.maxAttendees < 2) {
      errors.push('Maximum attendees must be at least 2');
    }

    // Validate location if any field is filled
    const locationFields = Object.values(formData.location).filter(Boolean);
    if (locationFields.length > 0 && locationFields.length < 4) {
      errors.push('Please complete all location fields');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    console.log('Submitting tournament form:', formData);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tournaments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Tournament created successfully:', data);
        toast.success('Tournament created successfully!');
        navigate(`/tournaments/${data.data._id}/to`);
      } else {
        const errorData = await response.json();
        console.error('Server error creating tournament:', errorData);
        toast.error(errorData.error || 'Failed to create tournament');
        throw new Error(errorData.error || 'Failed to create tournament');
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast.error('Error creating tournament. Please try again.');
    }
  };

  // Updated input styles to match the theme
  const inputStyles = {
    className: "!border-t-blue-gray-200 focus:!border-red-500 bg-gray-800/50 !text-white !border-white/20",
    labelProps: {
      className: "!text-gray-400 peer-focus:!text-red-500"
    }
  };

  const textareaStyles = {
    className: "!border-t-blue-gray-200 focus:!border-red-500 bg-gray-800",
    labelProps: {
      className: "text-gray-300 peer-focus:text-red-500"
    }
  };

  const selectStyles = {
    className: "!border-t-blue-gray-200 focus:!border-red-500 bg-gray-800",
    labelProps: {
      className: "text-gray-300 peer-focus:text-red-500"
    },
    menuProps: {
      className: "bg-gray-800 border border-gray-700"
    }
  };

  const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  return (
    <div className="flex flex-col items-center justify-start p-8 min-h-screen w-full">
      <Breadcrumbs />
      {/* Remove or update the background pattern div */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]">
      </div>

      {/* Header Card */}
      <Card className="w-full max-w-[64rem] bg-gray-800/50 text-white shadow-xl border border-white/10 rounded-lg overflow-hidden mb-8 relative z-10">
        <CardBody className="p-8">
          <Typography variant="h3" className="mb-4 text-center text-red-500 font-bold">
            Create Tournament
          </Typography>
          <Typography className="text-center text-gray-300">
            Set up your tournament details and configuration
          </Typography>
        </CardBody>
      </Card>

      {/* Main Form Card */}
      <Card className="w-full max-w-[64rem] bg-gray-800/50 text-white shadow-xl border border-white/10 rounded-lg overflow-hidden mb-8 relative z-10">
        <CardBody className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info Accordion */}
            <Accordion
              open={open === 1}
              animate={CUSTOM_ANIMATION}
              className="border border-white/10 rounded-lg mb-6 bg-gray-800/50"
            >
              <AccordionHeader
                onClick={() => handleOpen(1)}
                className="border-b-0 transition-colors text-white hover:!text-red-500 p-6 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-red-400" />
                  <Typography variant="h6">Basic Information</Typography>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${open === 1 ? "rotate-180" : ""} ml-auto`}
                />
              </AccordionHeader>
              <AccordionBody className="px-8 pb-8 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <Input
                    {...inputStyles}
                    type="text"
                    label="Tournament Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <Input
                    {...inputStyles}
                    type="text"
                    label="Slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-4">
                  <Textarea
                    {...inputStyles}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </AccordionBody>
            </Accordion>

            {/* Schedule & Format Accordion */}
            <Accordion
              open={open === 2}
              animate={CUSTOM_ANIMATION}
              className="border border-white/10 rounded-lg mb-6"
            >
              <AccordionHeader
                onClick={() => handleOpen(2)}
                className="border-b-0 transition-colors text-white hover:!text-red-500 p-6 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <Typography variant="h6">Schedule & Format</Typography>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${open === 2 ? "rotate-180" : ""} ml-auto`}
                />
              </AccordionHeader>
              <AccordionBody className="px-8 pb-8 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <Input
                    {...inputStyles}
                    type="datetime-local"
                    label="Start Date"
                    name="startAt"
                    value={formData.startAt}
                    onChange={handleInputChange}
                  />
                  <Input
                    {...inputStyles}
                    type="datetime-local"
                    label="End Date"
                    name="endAt"
                    value={formData.endAt}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <Input
                    {...inputStyles}
                    type="datetime-local"
                    label="Registration Start"
                    name="registrationStartAt"
                    value={formData.registrationStartAt}
                    onChange={handleInputChange}
                  />
                  <Input
                    {...inputStyles}
                    type="datetime-local"
                    label="Registration End"
                    name="registrationEndAt"
                    value={formData.registrationEndAt}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Select
                    {...inputStyles}
                    label="Tournament Type"
                    name="type"
                    value={formData.type}
                    onChange={(value) => handleInputChange({ target: { name: 'type', value } })}
                  >
                    <Option value="SINGLE_ELIMINATION">Single Elimination</Option>
                    <Option value="DOUBLE_ELIMINATION">Double Elimination</Option>
                    <Option value="ROUND_ROBIN">Round Robin</Option>
                  </Select>
                  <Select
                    {...inputStyles}
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={(value) => handleInputChange({ target: { name: 'status', value } })}
                  >
                    <Option value="DRAFT">Draft</Option>
                    <Option value="PUBLISHED">Published</Option>
                  </Select>
                </div>
              </AccordionBody>
            </Accordion>

            {/* Location Accordion */}
            <Accordion
              open={open === 3}
              animate={CUSTOM_ANIMATION}
              className="border border-white/10 rounded-lg mb-6"
            >
              <AccordionHeader
                onClick={() => handleOpen(3)}
                className="border-b-0 transition-colors text-white hover:!text-red-500 p-6 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <Typography variant="h6">Location Details</Typography>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${open === 3 ? "rotate-180" : ""} ml-auto`}
                />
              </AccordionHeader>
              <AccordionBody className="px-8 pb-8 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input
                    {...inputStyles}
                    type="text"
                    label="City"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                  />
                  <Input
                    {...inputStyles}
                    type="text"
                    label="State"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <Input
                    {...inputStyles}
                    type="text"
                    label="Country"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleInputChange}
                  />
                  <Input
                    {...inputStyles}
                    type="text"
                    label="Venue Address"
                    name="location.venueAddress"
                    value={formData.location.venueAddress}
                    onChange={handleInputChange}
                  />
                </div>
              </AccordionBody>
            </Accordion>

            {/* Additional Details Accordion */}
            <Accordion
              open={open === 4}
              animate={CUSTOM_ANIMATION}
              className="border border-white/10 rounded-lg mb-6"
            >
              <AccordionHeader
                onClick={() => handleOpen(4)}
                className="border-b-0 transition-colors text-white hover:!text-red-500 p-6 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-yellow-400" />
                  <Typography variant="h6">Additional Details</Typography>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${open === 4 ? "rotate-180" : ""} ml-auto`}
                />
              </AccordionHeader>
              <AccordionBody className="px-8 pb-8 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input
                    {...inputStyles}
                    type="number"
                    label="Expected Attendees"
                    name="numAttendees"
                    value={formData.numAttendees}
                    onChange={handleInputChange}
                  />
                  <Input
                    {...inputStyles}
                    type="number"
                    label="Maximum Attendees"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mt-8">
                  <div className="flex items-center gap-4">
                    <ImageIcon className="h-5 w-5 text-purple-400" />
                    <Input
                      {...inputStyles}
                      type="file"
                      label="Tournament Banner"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </AccordionBody>
            </Accordion>

            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white shadow-xl mt-8 py-4 text-lg font-medium transition-colors"
            >
              Create Tournament
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateTournament;

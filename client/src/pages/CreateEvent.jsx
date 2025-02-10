import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    useToast,
    Select,
    InputGroup,
    InputLeftElement,
    Icon,
    Heading,
    useColorModeValue,
} from "@chakra-ui/react";
import { ArrowUpFromLine, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import Compressor from "compressorjs";
import axios from "axios";

export const MotionBox = motion.create(Box);

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
    });

    const { token } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [compressedFile, setCompressedFile] = useState(null);
    const location = useLocation();
    const event = location.state?.event;

    useEffect(() => {
        if(!token) navigate('/login')
        if (event) {
            setFormData({
                title: event.title,
                description: event.description,
                date: event.date
                    ? new Date(event.date).toISOString().slice(0, 10)
                    : "",
                location: event.location,
                category: event.category,
            });
        }
    }, []);

    document.title = event  ? "Gatherly | Edit Event ": "Gatherly | Create Event"

    const handleCompressedUpload = (e) => {
        const image = e.target.files[0];
        new Compressor(image, {
            quality: 0.7,
            success: (compressedResult) => {
                setCompressedFile(compressedResult);
            },
            error(err) {
                console.log(err.message);
            },
        });
    };

    const uploadImage = async () => {
        const data = new FormData();
        data.append("file", compressedFile);
        data.append("upload_preset", "uploads");

        const uploadRes = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        const { url } = uploadRes.data;
        return url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (location.state?.edit) return handleUpdate(e);
        try {
            setLoading(true);
            const url = await uploadImage();

            const localDate = new Date(formData.date);
            const utcDate = new Date(
                localDate.getTime() - localDate.getTimezoneOffset() * 60000
            );

            const data = {
                ...formData,
                image: url || "",
                date: utcDate.toISOString(),
            };
            console.log("Original selected date:", formData.date);
            console.log("Adjusted UTC date:", utcDate.toISOString());

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error("Failed to create event");
            } else {
                toast({
                    title: "Event Created!",
                    description: "Your event has been successfully created.",
                    position: "top-right",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate("/");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create event. Please try again.",
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:3000/api/events/${event._id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create event");
            } else {
                toast({
                    title: "Event Created!",
                    description: "Your event has been successfully created.",
                    position: "top-right",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate("/user");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to edit event. Please try again.",
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            maxW="container.md"
            mx="auto"
            mt={8}
            p={6}
            borderRadius="lg"
            boxShadow="xl"
            bg={useColorModeValue("white", "gray.900")}
        >
            <Heading mb={6} size="lg" textAlign="center">
                Create New Event
            </Heading>

            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Event Title</FormLabel>
                        <Input
                            placeholder="Enter event title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            _focus={{
                                borderColor: "teal.500",
                                boxShadow: "0 0 0 1px teal.500",
                            }}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            placeholder="Describe your event"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            _focus={{
                                borderColor: "teal.500",
                                boxShadow: "0 0 0 1px teal.500",
                            }}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Category</FormLabel>
                        <Select
                            placeholder="Select category"
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    category: e.target.value,
                                })
                            }
                        >
                            <option value="conference">Conference</option>
                            <option value="workshop">Workshop</option>
                            <option value="meetup">Meetup</option>
                            <option value="social">Social</option>
                            <option value="competition">Competition</option>
                        </Select>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Date and Time</FormLabel>
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    date: e.target.value,
                                })
                            }
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Location</FormLabel>
                        <InputGroup>
                            <InputLeftElement
                                children={<Icon as={MapPin} color="gray.500" />}
                            />
                            <Input
                                placeholder="Event location"
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        location: e.target.value,
                                    })
                                }
                            />
                        </InputGroup>
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel>Choose a file to upload</FormLabel>
                        <InputGroup className="flex items-center">
                            <InputLeftElement
                                children={
                                    <Icon
                                        as={ArrowUpFromLine}
                                        color="gray.500"
                                    />
                                }
                            />
                            <Input
                                type="file"
                                onChange={handleCompressedUpload}
                            />
                        </InputGroup>
                    </FormControl>

                    <Button
                        type="submit"
                        colorScheme="teal"
                        size="lg"
                        width="full"
                        mt={4}
                        _hover={{
                            transform: "translateY(-2px)",
                            boxShadow: "lg",
                        }}
                        disabled={loading}
                    >
                        {loading
                            ? "Uploading"
                            : location.state?.edit
                            ? "Edit"
                            : "Create"}
                    </Button>
                </VStack>
            </form>
        </MotionBox>
    );
};

export default CreateEvent;

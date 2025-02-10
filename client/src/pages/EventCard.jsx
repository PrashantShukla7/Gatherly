import React from "react";
import {
    Box,
    Badge,
    Image,
    Text,
    Stack,
    Button,
    useToast,
    Flex,
    Icon,
    useColorModeValue,
} from "@chakra-ui/react";
// import { FaCalendar, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import { Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import axios from "../utils/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const MotionBox = motion.create(Box);

function EventCard({ event }) {
    const toast = useToast();
    const cardBg = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.600", "gray.200");
    const { user, token } = useAuth();

    const eventDate = new Date(event.date).toISOString().split("T")[0];
    const currentDate = new Date().toISOString().split("T")[0];

    const handleAttendClick = async () => {
        try {
            if (!token) throw new Error("You must login to attend the event");
            await axios.post(
                `/events/${event._id}/attend`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast({
                title: "Success!",
                description: "You're now attending this event!",
                status: "success",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to attend event",
                status: "error",
                duration: 3000,
                position: "top-right",
                isClosable: true,
            });
            console.error(error);
        }
    };

    return (
        <MotionBox
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={cardBg}
            boxShadow="lg"
        >
            <Image
                src={event.image || "/api/placeholder/400/200"}
                alt={event.title}
                height="200px"
                width="100%"
                objectFit="cover"
            />

            <Box p={6}>
                <Badge
                    borderRadius="full"
                    px="2"
                    colorScheme={eventDate > currentDate ? "teal" : "red"}
                >
                    {eventDate > currentDate ? "Upcoming" : "Past"}
                </Badge>

                <Text
                    mt={2}
                    fontSize="xl"
                    fontWeight="semibold"
                    lineHeight="short"
                    noOfLines={2}
                >
                    <Link to={`/event/${event._id}`}>{event.title}</Link>
                </Text>

                <Text mt={2} color={textColor} noOfLines={2}>
                    {event.description}
                </Text>

                <Stack mt={4} spacing={3}>
                    <Flex align="center">
                        <Icon as={Calendar} color="teal.500" />
                        <Text ml={2} color={textColor}>
                            {new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </Text>
                    </Flex>

                    <Flex align="center">
                        <Icon as={MapPin} color="teal.500" />
                        <Text ml={2} color={textColor}>
                            {event.location}
                        </Text>
                    </Flex>

                    <Flex align="center">
                        <Icon as={Users} color="teal.500" />
                        <Text ml={2} color={textColor}>
                            {event.attendees.length} attendees
                        </Text>
                    </Flex>
                </Stack>

                <Flex align="center" gap={4} justify={"center"}>
                    <Link to={`/event/${event._id}`} className="w-full">
                        <Button
                            mt={4}
                            colorScheme="blue"
                            width="full"
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "lg",
                            }}
                        >
                            Know More
                        </Button>
                    </Link>
                    {user && !event.attendees.includes(user._id) && new Date(event.date) >= new Date() && (
                        <Button
                            onClick={handleAttendClick}
                            mt={4}
                            colorScheme="teal"
                            width="full"
                            _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "lg",
                            }}
                        >
                            Attend Event
                        </Button>
                    )}
                </Flex>
            </Box>
        </MotionBox>
    );
}

export default EventCard;

import {
    Button,
    Icon,
    Box,
    Flex,
    Text,
    HStack,
    Divider,
    useColorModeValue,
    useToast,
    Image,
} from "@chakra-ui/react";
import { Calendar, MapPin, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "../components/Loading.jsx";

export default function EventDetails() {
    
    const { pathname } = useLocation();
    const id = pathname.split("/")[2];

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Theme-based colors
    const bgColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const headingColor = useColorModeValue("black", "white");
    const dividerColor = useColorModeValue("gray.300", "gray.700");
    const toast = useToast();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const fetchEventDetails = async () => {
        try {
            const response = await axios.get(`/events/${id}`);
            setEvent(response.data.event);
        } catch (error) {
            console.error("Error fetching event:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(!token)  navigate('/login')
        fetchEventDetails();
    }, []);

    if (loading) {
        return <Loading />
    }

    document.title = `Gatherly | ${event.title}`

    const handleAttendClick = async () => {
        try {
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

    return event ? (
        <Box className="py-10 px-[10%]" bg={bgColor} color={textColor}>
            {/* Event Title */}
            <Text
                fontSize="4xl"
                fontWeight="bold"
                textAlign="center"
                color={headingColor}
            >
                {event.title}
            </Text>

            <Image
                src={event.image} // Ensure event.imageUrl is a valid image URL
                alt={event.title}
                borderRadius="lg"
                width="100%"
                height="70vh"
                objectFit="cover"
                mb={6}
                mt={6}
            />

            {/* Event Info */}
            <Flex justify="space-between" align="center" mt={6} px={10}>
                <HStack>
                    <Icon as={Calendar} color="blue.400" />
                    <Text>
                        {new Date(event.date).toLocaleString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Text>
                </HStack>
                <HStack>
                    <Icon as={User} color="green.400" />
                    <Text>Organized by: {event.organizer.name}</Text>
                </HStack>
                <HStack>
                    <Icon as={MapPin} color="red.400" />
                    <Text>{event.location}</Text>
                </HStack>
            </Flex>

            <Divider my={6} borderColor={dividerColor} />

            {/* Description */}
            <Text fontSize="lg" textAlign="center" px={10}>
                {event.description}
            </Text>

            <Divider my={6} borderColor={dividerColor} />

            {/* Attendees & Join Button */}
            <Flex justify="space-between" align="center" px={10}>
                <HStack>
                    <Icon as={Users} color="yellow.400" />
                    <Text fontSize="lg" fontWeight="bold">
                        {event.attendees.length}
                    </Text>
                    <Text fontSize="sm">Attendees</Text>
                </HStack>

                {user && event.attendees.includes(user._id) && new Date(event.date) >= new Date() ? (
                    <Button
                        onClick={() => {
                            toast({
                                description:
                                    "You've already registered for this event!",
                                status: "warning",
                                duration: 3000,
                                position: "top-right",
                                isClosable: true,
                            });
                        }}
                        colorScheme="green"
                        size="lg"
                        borderRadius="lg"
                    >
                        Already registered
                    </Button>
                ) : (
                    <Button
                        onClick={handleAttendClick}
                        colorScheme="blue"
                        size="lg"
                        borderRadius="lg"
                    >
                        Attend Event
                    </Button>
                )}
            </Flex>
        </Box>
    ) : (
        <Flex
            className="min-h-screen bg-gray-900 text-white"
            justify="center"
            align="center"
        >
            <Text fontSize="2xl" fontWeight="bold">
                Event not found
            </Text>
        </Flex>
    );
}

import {
    Avatar,
    Button,
    Icon,
    Box,
    Flex,
    Text,
    VStack,
    HStack,
    Badge,
    Divider,
    useColorModeValue,
    useToast,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
} from "@chakra-ui/react";
import axios from "../utils/axios.js";
import {
    MapPin,
    Edit,
    Calendar,
    Eye,
    Pencil,
    Mail,
    Trash2,
} from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading.jsx";

export default function ProfilePage() {
    
    
    const bgColor = useColorModeValue("gray.100", "gray.800");
    const cardBg = useColorModeValue("white", "gray.900");
    const textColor = useColorModeValue("gray.700", "gray.200");
    const headingColor = useColorModeValue("black", "white");
    const dividerColor = useColorModeValue("gray.300", "gray.700");
    const { user, token } = useAuth();
    const badgeColor = (status) => (status === "Active" ? "green" : "red");
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [selectedEventId, setSelectedEventId] = useState(null);

    useEffect(() => {
        if (!token || !user) {
            navigate("/login");
        } else if (user) {
            fetchEvents(); // Fetch events only if user is logged in and token is present
        }
    }, []);

    const fetchEvents = async (req, res) => {
        try {
                const response = await axios.get(`/events/user/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setEvents(response.data.events.events);
        } catch (error) {
            console.error("Error fetching events:", error);
            res.status(500).json({ error: "Failed to fetch events" });
        }
    };

    const confirmDelete = (eventId) => {
        setSelectedEventId(eventId);
        onOpen();
    };

    const handleDeleteEvent = async () => {
        try {
            const response = await axios.delete(`/events/${selectedEventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                toast({
                    title: "Event Deleted!",
                    description: "Event has been successfully deleted.",
                    position: "top-right",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }
            onClose();
            fetchEvents();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete event. Please try again.",
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true,
            });
            console.error("Error deleting event:", error);
        }
    };

    document.title = user.name || "Profile"

    return (
        user ? 
        <Flex
            justify="center"
            align="center"
            minH="91vh"
            bg={bgColor}
            color={textColor}
            p={6}
        >
            <Box
                bg={cardBg}
                p={6}
                rounded="2xl"
                shadow="lg"
                w="full"
                maxW="xl"
                textAlign="center"
            >
                {/* User Info */}
                <VStack spacing={4}>
                    <Avatar
                        size="xl"
                        name={user.name}
                        src="https://via.placeholder.com/150"
                    />
                    <Text
                        fontSize="xl"
                        fontWeight="semibold"
                        color={headingColor}
                    >
                        {user.name}
                    </Text>
                    <HStack>
                        <Icon as={Mail} color="red.400" />
                        <Text color="gray.500">{user.email}</Text>
                    </HStack>
                </VStack>

                {/* Divider */}
                <Divider my={5} borderColor={dividerColor} />

                {/* Events Section */}
                <Text fontSize="lg" fontWeight="semibold">
                    📅 Your Events
                </Text>
                <VStack spacing={3} mt={3} w="full">
                    {events.length === 0 ? (
                        <Text fontSize="lg">
                            You have not created any Events yet.
                        </Text>
                    ) : (
                        events.map((event, i) => (
                            <Box
                                key={i}
                                w="full"
                                bg={useColorModeValue("gray.200", "gray.700")}
                                p={4}
                                rounded="lg"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <VStack align="start">
                                    <Text
                                        fontWeight="semibold"
                                        color={headingColor}
                                    >
                                        <Link to={`/event/${event._id}`}>
                                            {event.title}
                                        </Link>
                                    </Text>
                                    <HStack>
                                        <Icon as={Calendar} color="teal.400" />
                                        <Text fontSize="sm" color="gray.500">
                                            {new Date(
                                                event.date
                                            ).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </Text>
                                    </HStack>
                                    <Badge
                                        colorScheme={badgeColor(event.status)}
                                    >
                                        {event.status}
                                    </Badge>
                                </VStack>
                                <HStack>
                                    <Button
                                        size="sm"
                                        leftIcon={<Pencil />}
                                        colorScheme="blue"
                                        onClick={() =>
                                            navigate(`/edit/${event._id}`, {
                                                state: {
                                                    event,
                                                    edit: true,
                                                },
                                            })
                                        }
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        leftIcon={<Trash2 />}
                                        colorScheme="red"
                                        onClick={() => confirmDelete(event._id)}
                                    >
                                        Delete
                                    </Button>
                                </HStack>
                            </Box>
                        ))
                    )}
                </VStack>

                {/* Delete Confirmation Popup */}
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Delete Event
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure? You can't undo this action.
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    colorScheme="red"
                                    onClick={handleDeleteEvent}
                                    ml={3}
                                >
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Box>
        </Flex> : <Loading />
    );
}

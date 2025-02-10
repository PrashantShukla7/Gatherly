import React, { useEffect, useState } from "react";
import { Box, Container, Flex, FormControl, FormLabel, Grid, Heading, Input, Select, Text, useColorModeValue } from "@chakra-ui/react";
import io from "socket.io-client";
import EventCard from "../pages/EventCard.jsx";
import axios from "../utils/axios.js";

const socket = io(import.meta.env.VITE_BACKEND_URL);

function Home() {
    document.title = 'Gatherly | Home'
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState("upcoming");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`/events/?status=${filter}&startDate=${startDate}&endDate=${endDate}`);
            const data = response.data.events;
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();

        socket.on("newEvent", (event) => {
            setEvents((prev) => [...prev, event]);
        });

        socket.on("eventUpdated", (updatedEvent) => {
            setEvents((prev) =>
                prev.map((event) =>
                    event._id === updatedEvent._id ? updatedEvent : event
                )
            );
        });

        return () => {
            socket.off("newEvent");
            socket.off("eventUpdated");
        };
    }, [filter, startDate, endDate]);

    return (
        <Container maxW="container.xl" py={8}>
            <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align="flex-start"
                gap={6}
                mb={6}
            >
                <Heading size="lg" flex="1">Events</Heading>
                <Box w={{ base: "100%", md: "auto" }} flex="1">
                    <FormControl>
                        <FormLabel htmlFor="filter" fontWeight="md" color={useColorModeValue("gray.800", "gray.300")}>Event Type</FormLabel>
                        <Select
                            id="filter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="Select Event Type"
                        >
                            <option value="all">All</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                        </Select>
                    </FormControl>
                </Box>

                <Box w={{ base: "100%", md: "auto" }} flex="1">
                    <FormControl>
                        <FormLabel htmlFor="startDate" fontWeight="md" color={useColorModeValue("gray.800", "gray.300")}>Start Date</FormLabel>
                        <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </FormControl>
                </Box>

                <Box w={{ base: "100%", md: "auto" }} flex="1">
                    <FormControl>
                        <FormLabel htmlFor="endDate" fontWeight="md" color={useColorModeValue("gray.800", "gray.300")}>End Date</FormLabel>
                        <Input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </FormControl>
                </Box>
            </Flex>
            
            <Grid
                templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                gap={6}
            >
                {events.length !== 0 ? (
                    events.map((event) => (
                        <EventCard key={event._id} event={event} />
                    ))
                ) : (
                    <Text fontSize="lg" fontWeight="semibold">
                        No upcoming events available. Please check back later.
                    </Text>
                )}
            </Grid>
        </Container>
    );
}

export default Home;

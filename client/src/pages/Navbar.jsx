import React from "react";
import {
    Box,
    Flex,
    Button,
    useColorModeValue,
    Stack,
    useColorMode,
    IconButton,
    useDisclosure,
    HStack,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Avatar,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
// import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from "../context/AuthContext.jsx";
import { Moon, Sun, X } from "lucide-react";

function Navbar() {
    const { isOpen, onToggle } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const { user, logout } = useAuth();

    return (
        <Box>
            <Flex
                bg={useColorModeValue("white", "gray.900")}
                color={useColorModeValue("gray.600", "white")}
                minH={"60px"}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={"solid"}
                borderColor={useColorModeValue("gray.200", "gray.900")}
                align={"center"}
            >
                <Flex
                    flex={{ base: 1, md: "auto" }}
                    ml={{ base: -2 }}
                    display={{ base: "flex", md: "none" }}
                >
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <X /> : <Menu />}
                        variant={"ghost"}
                        aria-label={"Toggle Navigation"}
                    />
                </Flex>

                <Flex
                    flex={{ base: 1 }}
                    justify={{ base: "center", md: "start" }}
                >
                    <Text
                        textAlign={useColorModeValue("left", "center")}
                        fontFamily={"heading"}
                        color={useColorModeValue("gray.800", "white")}
                        as={RouterLink}
                        to="/"
                        fontSize="xl"
                        fontWeight="bold"
                    >
                        Gatherly
                    </Text>
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={"flex-end"}
                    direction={"row"}
                    spacing={6}
                >
                    <Flex
                        flex={{ base: 1 }}
                        justify={{ base: "center", md: "start" }}
                        className="gap-x-4 items-center"
                    >
                        
                        <Text
                            textAlign={useColorModeValue("left", "center")}
                            color={useColorModeValue("gray.800", "white")}
                            as={RouterLink}
                            to="/create-event"
                            fontSize="md"
                        >
                            Create
                        </Text>
                        
                    </Flex>
                    <Button onClick={toggleColorMode}>
                        {colorMode === "light" ? <Moon /> : <Sun />}
                    </Button>

                    {user ? (
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={"full"}
                                variant={"link"}
                                cursor={"pointer"}
                                minW={0}
                            >
                                <Avatar
                                    size={"sm"}
                                    src={
                                        user.avatar || "/api/placeholder/32/32"
                                    }
                                />
                            </MenuButton>
                            <MenuList>
                                <MenuItem as={RouterLink} to="/user">
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={logout}>Sign Out</MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <HStack spacing={4}>
                            <Button
                                as={RouterLink}
                                to="/login"
                                fontSize={"sm"}
                                fontWeight={400}
                                variant={"link"}
                            >
                                Sign In
                            </Button>
                            <Button
                                as={RouterLink}
                                to="/register"
                                display={{ base: "none", md: "inline-flex" }}
                                fontSize={"sm"}
                                fontWeight={600}
                                color={"white"}
                                bg={"teal.400"}
                                _hover={{
                                    bg: "teal.300",
                                }}
                            >
                                Sign Up
                            </Button>
                        </HStack>
                    )}
                </Stack>
            </Flex>
        </Box>
    );
}

export default Navbar;

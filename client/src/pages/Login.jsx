import { useForm } from "react-hook-form";
import axios from "../utils/axios.js";
import {
    FormLabel,
    FormControl,
    Input,
    Button,
    Heading,
    useColorModeValue,
    Alert,
    FormErrorMessage,
    AlertIcon,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import React from "react";
import { MotionBox } from "./CreateEvent.jsx";

export default function Login() {
    document.title = "Login"
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        setError
    } = useForm();
    const { login } = useAuth();

    const navigate = useNavigate();

    async function onSubmit(values) {
        try {
            const response = await axios.post(
                "/users/login",
                values
            );
            login(response.data.user, response.data.token);
            navigate("/");
        } catch (error) {
          setError("server", { type: "manual", message: error.response?.data?.message || "Invalid Credentials" });
        }
    }

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
                Login
            </Heading>

            {errors.server && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    {errors.server.message}
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.email} isRequired>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                        id="email"
                        placeholder="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
                              message: "Invalid email address",
                          },
                      })}
                    />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.password} isRequired>
                    <FormLabel htmlFor="password" className="mt-5">
                        Password
                    </FormLabel>
                    <Input
                        id="password"
                        placeholder="password"
                        {...register("password", {
                          required: "Password is required",
                      })}
                    />
                    <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                </FormControl>
                <Button
                    mt={5}
                    mb={3}
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    type="submit"
                >
                    Login
                </Button>
                <p className="mt-5 text-zinc-400 text-sm">
                    Don't have an account?{" "}
                    <span className="text-teal-500">
                        {" "}
                        <Link to="/register">Register</Link>
                    </span>
                </p>
            </form>
        </MotionBox>
    );
}

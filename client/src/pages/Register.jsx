import { useForm } from "react-hook-form";
import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    Input,
    Button,
    Heading,
    useColorModeValue,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import axios from "../utils/axios.js";
import { MotionBox } from "./CreateEvent.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function Register() {
    document.title = "Register"

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        setError,
        clearErrors
    } = useForm();
    const navigate = useNavigate();

    async function onSubmit(values) {
        try {
            const response = await axios.post(
                "/users/register",
                values
            );
            if(response.data.ok) {
              navigate('/login')
            } else {
              throw new Error ("Something went wrong")
            }
        } catch (error) {
            setError("server", {
                type: "manual",
                message: error.response?.data?.message || "Invalid Credentials",
            });
        }
    }

    useEffect(() => {
        if (errors.server) {
            clearErrors("server");
        }
    }, [errors, clearErrors]);

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
                Create New Account
            </Heading>
            {errors.server && (
                <Alert status="error" mb={4} position={"relative"}>
                    <AlertIcon />
                    {errors.server.message}
                    <div className="absolute right-3 cursor-pointer" onClick={() => clearErrors("server")}>
                        <X />   
                    </div>
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.name} isRequired>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input
                        id="name"
                        placeholder="name"
                        {...register("name", {
                            required: "This is required",
                            minLength: {
                                value: 4,
                                message: "Minimum length should be 4",
                            },
                        })}
                        onChange={() => clearErrors("server")}
                    />

                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>

                </FormControl>

                <FormControl isInvalid={errors.email} isRequired>
                    <FormLabel htmlFor="email" className="mt-4">
                        Email
                    </FormLabel>
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
                      onChange={() => clearErrors("server")}
                    />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.password} isRequired>
                    <FormLabel htmlFor="password" className="mt-4">
                        Password
                    </FormLabel>
                    <Input
                        id="password"
                        placeholder="password"
                        {...register("password", {
                            required: "This is required",
                            minLength: {
                                value: 4,
                                message: "Minimum length should be 4",
                            },
                        })}
                        onChange={() => clearErrors("server")}
                    />
                    
                    <FormErrorMessage>
                        {errors.password && errors.password.message}
                    </FormErrorMessage>
                </FormControl>
                <Button
                    mt={5}
                    mb={3}
                    colorScheme="teal"
                    isLoading={isSubmitting}
                    type="submit"
                >
                    Register
                </Button>
                <p className="text-zinc-400 text-sm">
                    Already have an account?{" "}
                    <span className="text-teal-500">
                        {" "}
                        <Link to="/login">Login</Link>
                    </span>
                </p>
            </form>
        </MotionBox>
    );
}

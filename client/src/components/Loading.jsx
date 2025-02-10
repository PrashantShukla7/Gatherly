import { Flex, Spinner } from "@chakra-ui/react";

const Loading = () => {

    return (
        <Flex
        className="min-h-[93vh] bg-gray-900 text-white"
        justify="center"
        align="center"
        >
        <Spinner size="xl" />
    </Flex>
);

}

export default Loading;
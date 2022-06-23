import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://essen.stepzen.net/api/mean-mule/__graphql",
    headers: {
        Authorization: `Apikey essen::stepzen.net+1000::bc63b5a57de1f9ba2ef1bbfe7c9d9058dbbe95ef6826ebc15b8082c8ec892b35`
    },
    cache: new InMemoryCache()
})

export default client 
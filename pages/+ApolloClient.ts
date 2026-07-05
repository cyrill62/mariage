// +ApolloClient.ts

import type { PageContext } from "vike/types";
import { ApolloClient, InMemoryCache } from "@apollo/client-react-streaming";
import { HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

export default (pageContext: PageContext) => {
  const httpLink = new HttpLink({
    uri: import.meta.env.API_URL || "https://cms.lepagnot.fr/graphql",
  });

  const authLink = new SetContextLink(({ headers }) => {
    const token =
      import.meta.env.API_TOKEN ||
      "3133ed3b5b299853545fe327f52e632c06c1e0c25ed2700738dfc8cd4c5f21109ca05a58321f25ffc966d242451240ad2e15597a2beb6af2477327449ba80aeb3eb7865b6ccaa4576946fef4529611705c894129cf63fd74390709fe51537c764e6c49f101efd02a3c05f0e6b01373a96c725c81cbd7b0b711e1874f11c6efc2";
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

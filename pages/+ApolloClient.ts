// +ApolloClient.ts

import type { PageContext } from "vike/types";
import { ApolloClient, InMemoryCache } from "@apollo/client-react-streaming";
import { HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";

export default (pageContext: PageContext) => {
  const httpLink = new HttpLink({
    uri: import.meta.env.PUBLIC_ENV__API_URL,
  });

  const authLink = new SetContextLink(({ headers }) => {
    const token = import.meta.env.PUBLIC_ENV__API_TOKEN;
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

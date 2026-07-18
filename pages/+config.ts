import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import vikeReactApollo from "vike-react-apollo/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

const config: Config = {
  // https://vike.dev/head-tags
  title: "Pamela & Cyril Wedding",
  description: "Demo showcasing Vike",
  prerender: true,
  clientRouting: true,
  hydrationCanBeAborted: true,
  extends: [vikeReact, vikeReactApollo],
};

export default config;

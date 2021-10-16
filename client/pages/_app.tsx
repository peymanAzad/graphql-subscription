import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
	ApolloProvider,
	ApolloClient,
	ApolloLink,
	Operation,
	FetchResult,
	Observable,
	HttpLink,
	split,
	InMemoryCache,
} from "@apollo/client";
import { print, GraphQLError } from "graphql";
import { createClient, ClientOptions, Client } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import WebSocketImp from "isomorphic-ws";
import { isServer } from "../src/isServer";

class WebSocketLink extends ApolloLink {
	private client: Client;

	constructor(options: ClientOptions) {
		super();
		this.client = createClient(options);
	}

	public request(operation: Operation): Observable<FetchResult> {
		return new Observable((sink) => {
			return this.client.subscribe<FetchResult>(
				{ ...operation, query: print(operation.query) },
				{
					next: sink.next.bind(sink),
					complete: sink.complete.bind(sink),
					error: (err) => {
						if (err instanceof Error) {
							return sink.error(err);
						}

						if (err instanceof CloseEvent) {
							return sink.error(
								// reason will be available on clean closes
								new Error(
									`Socket closed with event ${err.code} ${err.reason || ""}`
								)
							);
						}

						return sink.error(
							new Error(
								(err as GraphQLError[]).map(({ message }) => message).join(", ")
							)
						);
					},
				}
			);
		});
	}
}

const createApolloLink = () => {
	const httpLink = new HttpLink({
		uri: "http://localhost:4000/graphql",
	});

	const wsLink = new WebSocketLink({
		url: "ws://localhost:4000/graphql",
		webSocketImpl: WebSocketImp,
	});

	const splitLink = split(
		({ query }) => {
			if (isServer()) return false;
			const definition = getMainDefinition(query);
			return (
				definition.kind === "OperationDefinition" &&
				definition.operation === "subscription"
			);
		},
		wsLink,
		httpLink
	);
	return splitLink;
};

const createApolloClient = () => {
	const link = createApolloLink();

	const client = new ApolloClient({
		link: link,
		cache: new InMemoryCache(),
	});
	return client;
};

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ApolloProvider client={createApolloClient()}>
			<Component {...pageProps} />
		</ApolloProvider>
	);
}
export default MyApp;

import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Post {
	@Field()
	author: string;
	@Field()
	comment: string;
}

// package

const { graphqlHTTP } = require("express-graphql");

// files

const schema = require("../../graphql/schema/schema");
const resolver = require("../../graphql/resolver/resolver");

// graphql middleware

module.exports = graphqlHTTP({
  schema,
  rootValue: resolver,
  graphiql: true,

  customFormatErrorFn(err) {
    if (!err.originalError) {
      return err;
    }

    const { message = "An error occure", code = 500 } = err.originalError;
    return { status: code, message };
  }
});

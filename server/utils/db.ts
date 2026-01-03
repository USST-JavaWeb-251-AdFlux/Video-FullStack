import postgres from 'postgres';

const config = useRuntimeConfig();

const sql = postgres(config.dbUrl, {
    // transform: {
    //     undefined: null,
    // },
});

export default sql;

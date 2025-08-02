const allowlist = ["http://localhost:3000", "http://localhost:8000"];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowlist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    exposedHeaders: ["WWW-Authenticate"],
};

export default corsOptions;

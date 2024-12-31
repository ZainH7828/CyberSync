const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//const passport = require('passport');
//const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const authRoutes = require('./routes/authRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const organizationOnboardingRoutes = require('./routes/onboardingRoutes');

const modulesRoutes = require('./routes/ModulesRoutes');
const frameworkRoutes = require('./routes/frameworkRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const subCategoryIdRoutes = require('./routes/subCategoryIdRoutes');
const taskRoutes = require('./routes/TaskRoutes');
const subTaskRoutes = require('./routes/SubTaskRoutes');
const taskCommentsRoutes = require('./routes/TaskCommentsRoutes')
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const activitylogRoutes = require('./routes/activitylogRoutes');
const selfAssessmentRoutes = require('./routes/selfAssessmentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const connectDB = require('./db');

const app = express();

// Connect to the database
connectDB();

// Middleware
// CORS configuration options
const corsOptions = {
    origin: '*',  // Replace with your client domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
// app.use(passport.initialize());

// const jwtOptions = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_SECRET,
// };

// const getUserFromPayload = (payload) => {

//     return users.find(user => user.id === payload.id);
// };

// const jwtStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
//     const user = getUserFromPayload(payload);
//     if (user) {
//         return done(null, user);
//     } else {
//         return done(null, false);
//     }
// });

// passport.use(jwtStrategy);


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/organization-onboarding', organizationOnboardingRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/framework', frameworkRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/sub-category', subCategoryRoutes);
app.use('/api/sub-category-id', subCategoryIdRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/sub-task', subTaskRoutes);
app.use('/api/task/comments', taskCommentsRoutes);
app.use('/api/activitylog', activitylogRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/self-assessments', selfAssessmentRoutes);
app.use('/api/report', reportRoutes);

// Middleware to conditionally protect routes
// const authenticateJwt = (req, res, next) => {
//     const unprotectedRoutes = ['api/auth/update-password', 'api/auth/login'];
    
//     if (unprotectedRoutes.includes(req.path)) {
//         return next();
//     } else {
//         //passport.authenticate('jwt', { session: false })(req, res, next);
//     }
// };

// app.use(authenticateJwt);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
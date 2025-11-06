const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
require('./config/db');
const UserRoute = require('./routes/UserRoute');
const StaffRoute = require('./routes/StaffRoute');
const FeaturedClassRoute = require('./routes/featuredClassRoute');
const ClientRoute = require('./routes/ClientROute');
const EnrollRoute = require('./routes/EnrollRoute');
const PaymentRoute = require('./routes/PaymentRoute');
const NutritionPlanRoute = require('./routes/NutritionPlanRoute');
const WorkoutPlanRoute = require('./routes/WorkoutRoute');
const AdminStatsRoute = require('./routes/AdminStatsRoutes');
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/api',UserRoute)
app.use('/api',StaffRoute)
app.use('/api',FeaturedClassRoute)
app.use('/api',ClientRoute)
app.use('/api',EnrollRoute)
app.use('/api',PaymentRoute)
app.use('/api',NutritionPlanRoute);
app.use('/api',WorkoutPlanRoute);
app.use('/api',AdminStatsRoute);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

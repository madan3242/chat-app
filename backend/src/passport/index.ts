// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../config';
// import { User } from '../models';

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: GOOGLE_CALLBACK_URL,
//       scope: ["email", "profile"],
//     },
//     async function (accessToken, refreshToken, profile, next) {
//       let user = await User.findOne({ email: profile!.emails[0]!.value });
//       if (!user) {
//         user = User.create({
//           username: profile.displayName,
//           email: profile.emails[0].value,
//           image: profile.photos[0].value,
//         });
//         await user.save();
//       }
//       next(null, user);
//     }
//   )
// );

// passport.serializeUser((user, next) => {
//   next(null, user);
// });

// passport.deserializeUser((user, next) => {
//   next(null, user);
// })

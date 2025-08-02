// import { UserService } from '@/services/user.service';

export class UserController {
   // userService = new UserService();

  // getProfile = async (req, res, next) => {
  //   try {
  //     if (!req.user) {
  //       res.status(401).json({ error: 'User not authenticated' });
  //       return;
  //     }
  //
  //     //use typeorm to get the user profile
  //     const userProfile = await this.userService.getUserProfile(req.user.id);
  //     if (!userProfile) {
  //       res.status(404).json({ error: 'User not found' });
  //       return;
  //     }
  //     // Return the user profile
  //     res.json({
  //       message: 'User profile retrieved successfully',
  //       data: userProfile,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  //
  // updateProfile = async (req, res, next) => {
  //   try {
  //     if (!req.user) {
  //       res.status(401).json({ error: 'User not authenticated' });
  //       return;
  //     }
  //
  //     //use typeorm to update the user profile
  //     const updatedUser = await this.userService.updateUserProfile(req.user.id, req.body);
  //     if (!updatedUser) {
  //       res.status(404).json({ error: 'User not found' });
  //       return;
  //     }
  //     // Return the updated user profile
  //     res.json({
  //       message: 'Profile updated successfully',
  //       data: updatedUser,
  //     });
  //
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
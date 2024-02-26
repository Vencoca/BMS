// middleware/checkEndpointRole.js
import { roles } from '../utils/roles';

// const checkEndpointRole = (requiredRole) => async (req, res, next) => {
//     const userId = req.user._id;
//     const endpointId = req.params.endpointId;

//     await connectMongoDB()
//     const user = await User.findOne({ email }).select("_id")
//     const userRoleForEndpoint = await getUserRoleForEndpoint(userId, endpointId);

//     if (userRoleForEndpoint === requiredRole) {
//         next();
//     } else {
//         res.status(403).json({ message: 'Permission denied' });
//     }
// };

// export default checkEndpointRole;
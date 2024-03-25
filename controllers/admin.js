const User = require('../models/user');
const Business = require('../models/bussiness');
const Application = require('../models/applicationforbussiness');

const fetchadmindata = async (req, res) => {
    try {
        const totalUsersCount = await User.count(); // Total number of users
        const totalBusinessesCount = await Business.count(); // Total number of businesses
        const totalApplicationsCount = await Application.count(); // Total number of applications

        // Filter users with user type 'business'
        const businessUserCount = await User.count({
            where: {
                user_type: 'business'
            }
        });

        // Count business users with verification status 'pending'
        const pendingBusinessUserCount = await User.count({
            where: {
                user_type: 'business',
                verification_status: 'pending'
            }
        });

        // Filter users with user type 'franchise'
        const franchiseUserCount = await User.count({
            where: {
                user_type: 'franchise'
            }
        });

        // Count franchise users with verification status 'pending'
        const pendingFranchiseUserCount = await User.count({
            where: {
                user_type: 'franchise',
                verification_status: 'pending'
            }
        });

        // Count agreed applications
        const agreedApplicationsCount = await Application.count({
            where: {
                investor_verification_status: 'agreed',
                application_status: 'agreed'
            }
        });

        // Count pending applications
        const pendingApplicationsCount = await Application.count({
            where: {
                investor_verification_status: 'pending',
                application_status: 'pending'
            }
        });

        // Count businesses with status 'agreed'
        const agreedBusinessesCount = await Business.count({
            where: {
                admin_approval_status: 'agreed'
            }
        });

        // Count businesses with status 'pending'
        const pendingBusinessesCount = await Business.count({
            where: {
                admin_approval_status: 'pending'
            }
        });

        // Count users with user type 'business' and status 'agreed'
        const agreedBusinessUserCount = await User.count({
            where: {
                user_type: 'business',
                verification_status: 'agreed'
            }
        });

        // Count users with user type 'franchise' and status 'agreed'
        const agreedFranchiseUserCount = await User.count({
            where: {
                user_type: 'franchise',
                verification_status: 'agreed'
            }
        });

        return {
            totalUsersCount,
            totalBusinessesCount,
            totalApplicationsCount,
            businessUserCount,
            pendingBusinessUserCount,
            franchiseUserCount,
            pendingFranchiseUserCount,
            agreedApplicationsCount,
            pendingApplicationsCount,
            agreedBusinessUserCount,
            agreedFranchiseUserCount,
            agreedBusinessesCount,
            pendingBusinessesCount
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

module.exports = { fetchadmindata };

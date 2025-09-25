// backend/api/controllers/tenantController.js
// This endpoint is only required for the assignment.
// In a real app, this is handled by payment verification.
const Tenant = require('../models/Tenant');

exports.upgradeTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    
    // Check if the requesting admin belongs to this tenant
    if (tenant._id.toString() !== req.user.tenantId) {
        return res.status(403).json({ message: 'You can only upgrade your own tenant.' });
    }

    tenant.plan = 'pro';
    await tenant.save();
    res.json({ message: `Tenant ${tenant.name} upgraded to Pro plan.` });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
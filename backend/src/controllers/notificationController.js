const supabase = require('../config/supabase');

/**
 * Helper to create a notification internally from other controllers
 */
exports.createNotification = async (userId, userType, title, message, type, link = null) => {
  try {
    const { error } = await supabase.from('notifications').insert([{
      user_id: userId,
      user_type: userType,
      title,
      message,
      type,
      link
    }]);
    if (error) {
      console.error('[Notification Error] Failed to insert notification:', error.message);
    }
  } catch (err) {
    console.error('[Notification Error] Exception:', err.message);
  }
};

/**
 * Helper to notify all admins
 */
exports.notifyAdmins = async (title, message, type, link = null) => {
  try {
    const { data: admins } = await supabase.from('admins').select('id');
    if (!admins || admins.length === 0) return;
    
    const payloads = admins.map(admin => ({
      user_id: admin.id,
      user_type: 'admin',
      title,
      message,
      type,
      link
    }));
    
    await supabase.from('notifications').insert(payloads);
  } catch (err) {
    console.error('[Notification Error] notifyAdmins exception:', err.message);
  }
};

/**
 * GET /api/notifications
 * Fetch user's notifications
 */
exports.getNotifications = async (req, res) => {
  try {
    // req.user might be player or admin, req.coach might be coach.
    // the auth middleware sets req.user or req.coach depending on the route.
    let userId, userType;
    if (req.user && req.user.role === 'admin') {
      userId = req.user.id;
      userType = 'admin';
    } else if (req.coach) {
      userId = req.coach.id;
      userType = 'coach';
    } else if (req.user) {
      userId = req.user.id;
      userType = 'player';
    } else {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('user_type', userType)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error('[getNotifications]', err);
    res.status(500).json({ success: false, message: 'Server error fetching notifications' });
  }
};

/**
 * PUT /api/notifications/:id/read
 * Mark a single notification as read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('[markAsRead]', err);
    res.status(500).json({ success: false, message: 'Failed to mark as read' });
  }
};

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read for the user
 */
exports.markAllAsRead = async (req, res) => {
  try {
    let userId, userType;
    if (req.user && req.user.role === 'admin') {
      userId = req.user.id;
      userType = 'admin';
    } else if (req.coach) {
      userId = req.coach.id;
      userType = 'coach';
    } else if (req.user) {
      userId = req.user.id;
      userType = 'player';
    } else {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('user_type', userType)
      .eq('is_read', false);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error('[markAllAsRead]', err);
    res.status(500).json({ success: false, message: 'Failed to mark all as read' });
  }
};

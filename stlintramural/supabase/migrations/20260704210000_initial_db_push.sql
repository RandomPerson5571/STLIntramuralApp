-- 1. Create the custom Enum type for User Roles
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- 2. Create the User Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id VARCHAR(255) UNIQUE NOT NULL, -- Links to Supabase Auth / External Auth
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    points_balance INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create the Event Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT, -- Prevents deleting a host if they have active events
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    points_awarded INT NOT NULL DEFAULT 0 CONSTRAINT positive_points_awarded CHECK (points_awarded >= 0),
    max_attendees INT CONSTRAINT positive_max_attendees CHECK (max_attendees > 0),
    external_links TEXT[], -- PostgreSQL array type for multiple links
    qr_code_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure event doesn't end before it starts
    CONSTRAINT valid_event_dates CHECK (end_date >= start_date)
);

-- 4. Create the EventAttendance Join Table
CREATE TABLE event_attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- If a student is deleted, clear their attendance
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE, -- If an event is deleted, clear attendance records
    scanned_by UUID REFERENCES users(id) ON DELETE SET NULL, -- If a teacher is deleted, keep the record but set scanner to null
    attended_at TIMESTAMPTZ, -- Left NULL until the student is actually scanned in
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent a student from registering for the exact same event twice
    CONSTRAINT unique_user_event_registration UNIQUE (user_id, event_id)
);

-- 5. Create the PointTransaction Audit Log Table
CREATE TABLE point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    attendance_id UUID REFERENCES event_attendances(id) ON DELETE SET NULL,
    points INT NOT NULL, -- Can be positive (earned) or negative (spent)
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Optimization Indexes for Supabase Performance
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_events_host_id ON events(host_id);
CREATE INDEX idx_events_qr_code ON events(qr_code_token);
CREATE INDEX idx_attendance_user_event ON event_attendances(user_id, event_id);
CREATE INDEX idx_transactions_user_id ON point_transactions(user_id);
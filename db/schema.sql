
-- 核心用户与档案
CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('patient', 'doctor', 'saas_admin', 'enterprise_admin')),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    avatar_url VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_approval', 'suspended', 'invited', 'disabled')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    saas_enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id) ON DELETE SET NULL,
    saas_department_id VARCHAR(255) REFERENCES SaasDepartments(id) ON DELETE SET NULL,
    employee_number VARCHAR(100),
    role_title VARCHAR(100),
    join_date DATE,
    system_role_id VARCHAR(255) REFERENCES SaasSystemRoles(id) ON DELETE SET NULL
);

CREATE TABLE PatientProfiles (
    user_id VARCHAR(255) PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    record_number VARCHAR(100) UNIQUE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    date_of_birth DATE,
    marital_status VARCHAR(20) CHECK (marital_status IN ('unmarried', 'married', 'divorced', 'widowed', 'other')),
    occupation VARCHAR(100),
    nationality VARCHAR(100),
    birthplace VARCHAR(255),
    address VARCHAR(255),
    contact_email VARCHAR(255),
    blood_type VARCHAR(10) CHECK (blood_type IN ('A', 'B', 'O', 'AB', 'unknown')),
    education_level VARCHAR(100),
    had_previous_checkup BOOLEAN DEFAULT FALSE,
    agrees_to_intervention BOOLEAN DEFAULT FALSE,
    admission_date DATE,
    record_date DATE,
    informant VARCHAR(100),
    reliability VARCHAR(50) CHECK (reliability IN ('reliable', 'partially_reliable', 'unreliable')),
    chief_complaint TEXT,
    history_of_present_illness TEXT,
    past_medical_history_details TEXT,
    past_illnesses_json JSONB,
    infectious_diseases_json JSONB,
    vaccination_history TEXT,
    operation_history_json JSONB,
    trauma_history TEXT,
    blood_transfusion_history TEXT,
    personal_history_birth_place VARCHAR(255),
    personal_history_living_conditions TEXT,
    personal_history_drug_abuse TEXT,
    personal_history_menstrual_obstetric TEXT,
    allergies_json JSONB,
    other_allergy_text VARCHAR(255),
    current_symptoms_json JSONB,
    medication_categories_json JSONB,
    contact_history_json JSONB,
    dietary_habits_breakfast_days VARCHAR(50),
    dietary_habits_late_snack_days VARCHAR(50),
    dietary_habits_bad_habits_json JSONB,
    dietary_habits_preferences_json JSONB,
    dietary_habits_food_type_prefs_json JSONB,
    dietary_intake_staple VARCHAR(50),
    dietary_intake_meat VARCHAR(50),
    dietary_intake_fish VARCHAR(50),
    dietary_intake_eggs VARCHAR(50),
    dietary_intake_dairy VARCHAR(50),
    dietary_intake_soy VARCHAR(50),
    dietary_intake_vegetables VARCHAR(50),
    dietary_intake_fruits VARCHAR(50),
    dietary_intake_water VARCHAR(50),
    exercise_work_hours VARCHAR(50),
    exercise_sedentary_hours VARCHAR(50),
    exercise_weekly_frequency VARCHAR(50),
    exercise_duration_per_session VARCHAR(50),
    exercise_intensity VARCHAR(50),
    smoking_status VARCHAR(50),
    smoking_cigarettes_per_day VARCHAR(50),
    smoking_years VARCHAR(50),
    smoking_passive_days VARCHAR(50),
    drinking_status VARCHAR(50),
    drinking_type VARCHAR(50),
    drinking_type_other VARCHAR(255),
    drinking_amount_per_day VARCHAR(50),
    drinking_years VARCHAR(50),
    mental_health_major_events VARCHAR(10),
    mental_health_impact_on_life VARCHAR(50),
    mental_health_stress_level VARCHAR(50),
    mental_health_sas_anxiety VARCHAR(50),
    mental_health_sas_fear VARCHAR(50),
    mental_health_sas_panic VARCHAR(50),
    mental_health_sas_going_crazy VARCHAR(50),
    mental_health_sas_misfortune VARCHAR(50),
    mental_health_sas_trembling VARCHAR(50),
    mental_health_sas_body_pain VARCHAR(50),
    mental_health_sas_fatigue VARCHAR(50),
    mental_health_sas_restlessness VARCHAR(50),
    mental_health_sas_palpitations VARCHAR(50),
    mental_health_sas_dizziness VARCHAR(50),
    mental_health_sas_fainting VARCHAR(50),
    mental_health_sas_breathing_difficulty VARCHAR(50),
    mental_health_sas_paresthesia VARCHAR(50),
    mental_health_sas_stomach_pain VARCHAR(50),
    mental_health_sas_frequent_urination VARCHAR(50),
    mental_health_sas_sweating VARCHAR(50),
    adherence_self_assessment_body VARCHAR(50),
    adherence_self_assessment_mind VARCHAR(50),
    adherence_priority_problems_json JSONB,
    adherence_doctor_advice_compliance VARCHAR(50),
    adherence_health_promotion_methods_json JSONB,
    adherence_other_health_promotion VARCHAR(255),
    sleep_adequacy VARCHAR(50),
    other_info_medications_used TEXT,
    other_info_contact_preference_method VARCHAR(50),
    other_info_contact_preference_method_other VARCHAR(255),
    other_info_contact_preference_frequency VARCHAR(50),
    other_info_contact_preference_frequency_other VARCHAR(255),
    other_info_contact_preference_time VARCHAR(50),
    other_info_contact_preference_time_other VARCHAR(255),
    other_info_suggestions TEXT,
    other_info_service_satisfaction VARCHAR(50),
    managing_doctor_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE PatientFamilyMedicalHistory (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    relative_type VARCHAR(50) NOT NULL CHECK (relative_type IN ('self', 'father', 'mother', 'paternal_grandparents', 'maternal_grandparents')),
    condition_name VARCHAR(100) NOT NULL,
    notes TEXT
);

CREATE TABLE PatientMedicationHistory (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    drug_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    notes TEXT
);

CREATE TABLE EmergencyContacts (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DoctorProfiles (
    user_id VARCHAR(255) PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    specialty VARCHAR(100),
    bio TEXT
);

-- 健康数据与记录
CREATE TABLE HealthDataRecords (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('blood_sugar', 'blood_pressure', 'weight', 'lipids', 'exercise', 'activity')),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    value_numeric1 DECIMAL(10,2),
    value_numeric2 DECIMAL(10,2),
    value_numeric3 DECIMAL(10,2),
    value_numeric4 DECIMAL(10,2),
    unit1 VARCHAR(20),
    unit2 VARCHAR(20),
    value_text VARCHAR(255),
    notes TEXT,
    source VARCHAR(20) DEFAULT 'manual' CHECK (source IN ('manual', 'device_sync')),
    device_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ExaminationReports (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    doctor_user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(20) NOT NULL CHECK (report_type IN ('image', 'pdf', 'other')),
    file_url VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    report_date DATE
);

CREATE TABLE DietRecords (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    total_calories INT,
    total_protein DECIMAL(10,2),
    total_carbs DECIMAL(10,2),
    total_fat DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE DietRecordItems (
    id VARCHAR(255) PRIMARY KEY,
    diet_record_id VARCHAR(255) NOT NULL REFERENCES DietRecords(id) ON DELETE CASCADE,
    food_name VARCHAR(255) NOT NULL,
    quantity_description VARCHAR(100) NOT NULL,
    calories INT,
    protein DECIMAL(10,2),
    carbs DECIMAL(10,2),
    fat DECIMAL(10,2),
    food_database_id VARCHAR(255) REFERENCES FoodDatabase(id) ON DELETE SET NULL
);

CREATE TABLE FoodDatabase (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    calories_per_100g INT,
    protein_per_100g DECIMAL(10,2),
    carbs_per_100g DECIMAL(10,2),
    fat_per_100g DECIMAL(10,2),
    unit_description VARCHAR(50) DEFAULT '100g',
    created_by_user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL
);

-- 互动与提醒
CREATE TABLE Consultations (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    doctor_user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending_reply', 'replied', 'closed', 'scheduled', 'pending_confirmation', 'completed', 'cancelled')),
    source VARCHAR(50) CHECK (source IN ('app', 'wechat_mini_program', 'wechat_personal', 'wechat_group')),
    attachments_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    doctor_reply_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reply_content TEXT
);

CREATE TABLE ConsultationMessages (
    id VARCHAR(255) PRIMARY KEY,
    consultation_id VARCHAR(255) NOT NULL REFERENCES Consultations(id) ON DELETE CASCADE,
    sender_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    message_content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file', 'audio')),
    file_url VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Reminders (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    reminder_type VARCHAR(50) NOT NULL CHECK (reminder_type IN ('medication', 'checkup', 'appointment', 'custom')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    frequency_cron VARCHAR(100),
    is_enabled BOOLEAN DEFAULT TRUE,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ReminderLogs (
    id VARCHAR(255) PRIMARY KEY,
    reminder_id VARCHAR(255) NOT NULL REFERENCES Reminders(id) ON DELETE CASCADE,
    action_taken VARCHAR(20) NOT NULL CHECK (action_taken IN ('taken', 'skipped', 'done', 'missed')),
    action_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- 扩展功能 (病人端)
CREATE TABLE HealthCourses (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    duration_text VARCHAR(100),
    image_url VARCHAR(255),
    content_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PatientCourseEnrollments (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    course_id VARCHAR(255) NOT NULL REFERENCES HealthCourses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed'))
);

CREATE TABLE CommunityPosts (
    id VARCHAR(255) PRIMARY KEY,
    author_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    likes_count INT DEFAULT 0
);

CREATE TABLE CommunityComments (
    id VARCHAR(255) PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL REFERENCES CommunityPosts(id) ON DELETE CASCADE,
    author_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    parent_comment_id VARCHAR(255) REFERENCES CommunityComments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 医生端特定功能
CREATE TABLE Appointments (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    doctor_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    appointment_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT DEFAULT 30,
    reason TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled_by_patient', 'cancelled_by_doctor', 'pending_confirmation')),
    notes_patient TEXT,
    notes_doctor TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TreatmentPlans (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    doctor_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    plan_name VARCHAR(255) DEFAULT '默认治疗方案',
    start_date DATE NOT NULL,
    end_date DATE,
    short_term_goals TEXT,
    long_term_goals TEXT,
    lifestyle_adjustments TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TreatmentPlanMedications (
    id VARCHAR(255) PRIMARY KEY,
    treatment_plan_id VARCHAR(255) NOT NULL REFERENCES TreatmentPlans(id) ON DELETE CASCADE,
    drug_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    notes TEXT,
    med_start_date DATE,
    med_end_date DATE
);

CREATE TABLE TreatmentAdvices (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    doctor_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    treatment_plan_id VARCHAR(255) REFERENCES TreatmentPlans(id) ON DELETE SET NULL,
    advice_content TEXT NOT NULL,
    advice_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT '待执行' CHECK (status IN ('待执行', '已执行', '已取消', 'pending', 'acknowledged', 'implemented', 'rejected')),
    patient_feedback_notes TEXT
);

-- SAAS 管理后台表结构
CREATE TABLE SaasEnterprises (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    contact_person VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    contact_phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('active', 'inactive', 'pending_approval', 'suspended')),
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_resources_json JSONB,
    current_users_count INT DEFAULT 0,
    current_patients_count INT DEFAULT 0,
    notes TEXT,
    service_package_id VARCHAR(255) REFERENCES SaasServicePackages(id) ON DELETE SET NULL
);

CREATE TABLE SaasDepartments (
    id VARCHAR(255) PRIMARY KEY,
    saas_enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    parent_department_id VARCHAR(255) REFERENCES SaasDepartments(id) ON DELETE SET NULL,
    head_employee_user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    description TEXT,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE SaasSystemRoles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions_json JSONB NOT NULL
);

CREATE TABLE SaasServicePackages (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('basic', 'standard', 'premium', 'custom')),
    price_monthly DECIMAL(10,2) NOT NULL,
    price_annually DECIMAL(10,2),
    features_json JSONB NOT NULL,
    highlights TEXT,
    max_users_limit INT NOT NULL,
    max_storage_gb_limit INT NOT NULL,
    max_patients_limit INT NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE SaasOrders (
    id VARCHAR(255) PRIMARY KEY,
    saas_enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    saas_service_package_id VARCHAR(255) NOT NULL REFERENCES SaasServicePackages(id) ON DELETE RESTRICT,
    order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'processing')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'CNY',
    transaction_id VARCHAR(255) UNIQUE,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'annually', 'one-time')),
    renewal_date DATE,
    invoice_number VARCHAR(100),
    notes TEXT
);

CREATE TABLE SaasPlatformConnections (
    id VARCHAR(255) PRIMARY KEY,
    enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('wechat_personal_bot', 'wechat_enterprise_app', 'other')),
    account_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('connected', 'disconnected', 'error', 'requires_reauth', 'pending_setup')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    associated_employee_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE SaasCommunityGroups (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    managing_employee_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('personal_wechat_group', 'enterprise_wechat_group', 'other_platform_group')),
    platform_group_id VARCHAR(255) UNIQUE,
    description TEXT,
    member_patient_ids_json JSONB,
    patient_count INT DEFAULT 0,
    platform_connection_id VARCHAR(255) REFERENCES SaasPlatformConnections(id) ON DELETE SET NULL,
    connection_status VARCHAR(50) NOT NULL DEFAULT 'not_monitored' CHECK (connection_status IN ('active_sync', 'inactive_sync', 'error_sync', 'not_monitored')),
    last_log_sync_at TIMESTAMP WITH TIME ZONE,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tags_json JSONB
);

CREATE TABLE SaasCommunityMessageLogs (
    id VARCHAR(255) PRIMARY KEY,
    community_group_id VARCHAR(255) NOT NULL REFERENCES SaasCommunityGroups(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    platform_group_id_external VARCHAR(255),
    platform_message_id_external VARCHAR(255) NOT NULL UNIQUE,
    sender_platform_id VARCHAR(255) NOT NULL,
    sender_saas_user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    sender_name_display VARCHAR(255) NOT NULL,
    message_content TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('text', 'image', 'file', 'voice', 'system_notification', 'video')),
    file_url VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_bot_message BOOLEAN DEFAULT FALSE,
    metadata_json JSONB
);

CREATE TABLE SaasSopServices (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Coze', 'Dify', 'Other')),
    api_endpoint VARCHAR(255) NOT NULL,
    api_key VARCHAR(512),
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
    parameters_json JSONB,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_call_at TIMESTAMP WITH TIME ZONE,
    call_count INT DEFAULT 0,
    error_count INT DEFAULT 0
);

CREATE TABLE SaasAiWorkflowApiConfigs (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Dify', 'Coze', 'Other')),
    api_endpoint VARCHAR(255) NOT NULL,
    api_key VARCHAR(512),
    parameters_json JSONB,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE SaasOutboundCallTasks (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    creating_doctor_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    creating_saas_admin_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('individual_patient', 'patient_group', 'custom_list', 'employee_group')),
    target_patient_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    target_group_id VARCHAR(255) REFERENCES OutboundCallGroups(id) ON DELETE SET NULL,
    target_custom_list_details TEXT,
    target_description VARCHAR(255),
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending_schedule', 'scheduled', 'in_progress', 'completed', 'failed', 'cancelled')),
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    call_content_summary TEXT,
    sop_service_id VARCHAR(255) REFERENCES SaasSopServices(id) ON DELETE SET NULL,
    assigned_to_employee_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    call_count_total INT DEFAULT 0,
    call_count_success INT DEFAULT 0,
    completion_status VARCHAR(50) CHECK (completion_status IN ('success_all', 'partial_success', 'failed_all', 'not_applicable')),
    notes TEXT
);

CREATE TABLE SaasApiKeys (
    id VARCHAR(255) PRIMARY KEY,
    saas_enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    key_value_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(10) NOT NULL UNIQUE,
    description VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
    rate_limit_per_minute INT,
    permissions_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE SaasSystemSettings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description VARCHAR(255),
    last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE SaasLlmSettings (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'primary_llm_config',
    api_key VARCHAR(512) NOT NULL,
    api_endpoint VARCHAR(255) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OutboundCallGroups (
    id VARCHAR(255) PRIMARY KEY,
    saas_enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE SET NULL,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    member_count INT DEFAULT 0
);

CREATE TABLE OutboundCallGroupMembers (
    group_id VARCHAR(255) NOT NULL REFERENCES OutboundCallGroups(id) ON DELETE CASCADE,
    target_id VARCHAR(255) NOT NULL, -- Can be patient_user_id or employee_user_id from Users table
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('patient', 'employee')),
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, target_id, target_type)
);

CREATE TABLE SaasScheduledTasks (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('data_backup', 'report_generation', 'notification_push', 'system_cleanup', 'external_sync')),
    cron_expression VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('enabled', 'disabled', 'running', 'error')),
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    last_run_status VARCHAR(50),
    description TEXT,
    job_handler_identifier VARCHAR(255) NOT NULL
);

CREATE TABLE SystemLogs (
    log_id SERIAL PRIMARY KEY, -- For PostgreSQL, or BIGINT AUTO_INCREMENT for MySQL
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    level VARCHAR(10) NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR', 'DEBUG', 'FATAL')),
    source VARCHAR(100),
    user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    context_json JSONB,
    ip_address VARCHAR(45)
);

-- Trigger for updated_at on Users table (Example for PostgreSQL)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON Users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Similar triggers can be created for other tables needing an `updated_at` field.

```
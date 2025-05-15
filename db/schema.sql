
-- AI 慢病管理系统 - SQL Schema
-- 适用于 PostgreSQL (可以稍作调整用于 MySQL 等其他关系型数据库)

-- 核心用户与档案
CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('patient', 'doctor', 'saas_admin')),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    avatar_url VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_approval', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    saas_enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id) ON DELETE SET NULL,
    saas_department_id VARCHAR(255) REFERENCES SaasDepartments(id) ON DELETE SET NULL
);
COMMENT ON TABLE Users IS '用户表 - 通用';
COMMENT ON COLUMN Users.user_type IS '用户类型 (patient, doctor, saas_admin)';
COMMENT ON COLUMN Users.status IS '账户状态';
COMMENT ON COLUMN Users.saas_enterprise_id IS '(外键) 所属SAAS企业ID (医生/企业员工)';
COMMENT ON COLUMN Users.saas_department_id IS '(外键) 所属SAAS部门ID (医生/企业员工)';


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
    mental_health_sas_goingCrazy VARCHAR(50),
    mental_health_sas_misfortune VARCHAR(50),
    mental_health_sas_trembling VARCHAR(50),
    mental_health_sas_bodyPain VARCHAR(50),
    mental_health_sas_fatigue VARCHAR(50),
    mental_health_sas_restlessness VARCHAR(50),
    mental_health_sas_palpitations VARCHAR(50),
    mental_health_sas_dizziness VARCHAR(50),
    mental_health_sas_fainting VARCHAR(50),
    mental_health_sas_breathingDifficulty VARCHAR(50),
    mental_health_sas_paresthesia VARCHAR(50),
    mental_health_sas_stomachPain VARCHAR(50),
    mental_health_sas_frequentUrination VARCHAR(50),
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
COMMENT ON TABLE PatientProfiles IS '病人档案表';

CREATE TABLE PatientFamilyMedicalHistory (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    relative_type VARCHAR(50) NOT NULL CHECK (relative_type IN ('self', 'father', 'mother', 'paternal_grandparents', 'maternal_grandparents')),
    condition_name VARCHAR(100) NOT NULL,
    notes TEXT,
    UNIQUE (patient_user_id, relative_type, condition_name) -- Ensure a relative doesn't have the same condition twice
);
COMMENT ON TABLE PatientFamilyMedicalHistory IS '病人家族病史表';

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
COMMENT ON TABLE PatientMedicationHistory IS '病人用药史表';

CREATE TABLE EmergencyContacts (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE EmergencyContacts IS '紧急联系人表';

CREATE TABLE DoctorProfiles (
    user_id VARCHAR(255) PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    specialty VARCHAR(100),
    hospital_affiliation VARCHAR(255), -- May be derived from Users.saas_enterprise_id
    years_of_experience INT,
    license_number VARCHAR(100),
    bio TEXT
);
COMMENT ON TABLE DoctorProfiles IS '医生档案表';

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
COMMENT ON TABLE HealthDataRecords IS '健康数据记录表';

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
COMMENT ON TABLE ExaminationReports IS '检查报告表';

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
COMMENT ON TABLE DietRecords IS '饮食记录表';

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
COMMENT ON TABLE DietRecordItems IS '饮食记录条目表';

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
COMMENT ON TABLE FoodDatabase IS '食物数据库表';

-- 互动与提醒
CREATE TABLE Consultations (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    doctor_user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending_reply', 'replied', 'closed', 'scheduled', 'pending_confirmation')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    doctor_reply_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE Consultations IS '医患咨询表';

CREATE TABLE ConsultationMessages (
    id VARCHAR(255) PRIMARY KEY,
    consultation_id VARCHAR(255) NOT NULL REFERENCES Consultations(id) ON DELETE CASCADE,
    sender_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    message_content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file')),
    file_url VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE ConsultationMessages IS '咨询消息表';

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
COMMENT ON TABLE Reminders IS '提醒表 - 通用';

CREATE TABLE ReminderLogs (
    id VARCHAR(255) PRIMARY KEY,
    reminder_id VARCHAR(255) NOT NULL REFERENCES Reminders(id) ON DELETE CASCADE,
    action_taken VARCHAR(20) NOT NULL CHECK (action_taken IN ('taken', 'skipped', 'done', 'missed')),
    action_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);
COMMENT ON TABLE ReminderLogs IS '提醒执行记录表';

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
COMMENT ON TABLE HealthCourses IS '健康课程表';

CREATE TABLE PatientCourseEnrollments (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    course_id VARCHAR(255) NOT NULL REFERENCES HealthCourses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed'))
);
COMMENT ON TABLE PatientCourseEnrollments IS '病人课程报名表';

CREATE TABLE CommunityPosts (
    id VARCHAR(255) PRIMARY KEY,
    author_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    likes_count INT DEFAULT 0
);
COMMENT ON TABLE CommunityPosts IS '社区帖子表';

CREATE TABLE CommunityComments (
    id VARCHAR(255) PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL REFERENCES CommunityPosts(id) ON DELETE CASCADE,
    author_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    parent_comment_id VARCHAR(255) REFERENCES CommunityComments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE CommunityComments IS '社区评论表';

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
COMMENT ON TABLE Appointments IS '预约表';

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
COMMENT ON TABLE TreatmentPlans IS '治疗方案表';

CREATE TABLE TreatmentPlanMedications (
    id VARCHAR(255) PRIMARY KEY,
    treatment_plan_id VARCHAR(255) NOT NULL REFERENCES TreatmentPlans(id) ON DELETE CASCADE,
    drug_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    notes TEXT,
    start_date DATE NOT NULL,
    end_date DATE
);
COMMENT ON TABLE TreatmentPlanMedications IS '治疗方案药物表';

CREATE TABLE TreatmentAdvices (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    doctor_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    treatment_plan_id VARCHAR(255) REFERENCES TreatmentPlans(id) ON DELETE SET NULL,
    advice_content TEXT NOT NULL,
    advice_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    patient_feedback_status VARCHAR(50) DEFAULT 'pending' CHECK (patient_feedback_status IN ('pending', 'acknowledged', 'implemented', 'rejected')),
    patient_feedback_notes TEXT
);
COMMENT ON TABLE TreatmentAdvices IS '治疗建议记录表';

CREATE TABLE DoctorPatientMessages (
    id VARCHAR(255) PRIMARY KEY,
    sender_doctor_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    recipient_patient_id VARCHAR(255) REFERENCES Users(id) ON DELETE CASCADE,
    recipient_group_id VARCHAR(255) REFERENCES OutboundCallGroups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_count INT DEFAULT 0,
    delivery_status VARCHAR(50) DEFAULT 'sent'
);
COMMENT ON TABLE DoctorPatientMessages IS '医患消息推送表 - 医生端发起';

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
    max_users_limit INT NOT NULL,
    max_storage_gb_limit INT NOT NULL,
    max_patients_limit INT NOT NULL,
    current_users_count INT DEFAULT 0,
    current_patients_count INT DEFAULT 0,
    notes TEXT,
    service_package_id VARCHAR(255) REFERENCES SaasServicePackages(id) ON DELETE SET NULL
);
COMMENT ON TABLE SaasEnterprises IS 'SAAS企业/医院表';

CREATE TABLE SaasDepartments (
    id VARCHAR(255) PRIMARY KEY,
    saas_enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    parent_department_id VARCHAR(255) REFERENCES SaasDepartments(id) ON DELETE SET NULL,
    head_employee_user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    description TEXT,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasDepartments IS 'SAAS企业部门表';
-- Note: Users table's saas_enterprise_id and saas_department_id handle employee linkage.

CREATE TABLE SaasSystemRoles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL -- Array of permission strings
);
COMMENT ON TABLE SaasSystemRoles IS 'SAAS平台系统角色表';

CREATE TABLE SaasUserSystemRoles (
    saas_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    saas_system_role_id VARCHAR(255) NOT NULL REFERENCES SaasSystemRoles(id) ON DELETE CASCADE,
    PRIMARY KEY (saas_user_id, saas_system_role_id)
);
COMMENT ON TABLE SaasUserSystemRoles IS 'SAAS平台用户角色关联表';

CREATE TABLE SaasServicePackages (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('basic', 'standard', 'premium', 'custom')),
    price_monthly DECIMAL(10,2) NOT NULL,
    price_annually DECIMAL(10,2),
    features_json JSONB NOT NULL, -- Array of feature strings
    highlights TEXT,
    max_users_limit INT NOT NULL,
    max_storage_gb_limit INT NOT NULL,
    max_patients_limit INT NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasServicePackages IS 'SAAS服务包表';

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
COMMENT ON TABLE SaasOrders IS 'SAAS订单表';

CREATE TABLE SaasCommunityMessageLogs (
    id VARCHAR(255) PRIMARY KEY,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('wechat_personal', 'wechat_enterprise')),
    group_id_external VARCHAR(255) NOT NULL,
    group_name VARCHAR(255),
    sender_external_id VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    message_external_id VARCHAR(255) NOT NULL UNIQUE,
    message_content_type VARCHAR(50) NOT NULL,
    message_text TEXT,
    message_file_url VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    raw_data_json JSONB,
    logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasCommunityMessageLogs IS 'SAAS社群消息日志表';

CREATE TABLE SaasSopServices (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Coze', 'Dify', 'Other')),
    api_endpoint VARCHAR(255) NOT NULL,
    api_key_encrypted VARCHAR(512), -- Store encrypted
    description TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'error')),
    parameters_json JSONB,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_call_timestamp TIMESTAMP WITH TIME ZONE,
    total_call_count INT DEFAULT 0,
    error_count INT DEFAULT 0
);
COMMENT ON TABLE SaasSopServices IS 'SAAS SOP服务配置表';

CREATE TABLE SaasOutboundCallTasks (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('customer_segment', 'employee_group', 'custom_list', 'individual_patient')),
    target_details TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending_schedule', 'scheduled', 'in_progress', 'completed', 'failed', 'cancelled')),
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    sop_service_id VARCHAR(255) REFERENCES SaasSopServices(id) ON DELETE SET NULL,
    assigned_user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL, -- Assuming SAAS user
    call_count_total INT DEFAULT 0,
    call_count_success INT DEFAULT 0,
    notes TEXT
);
COMMENT ON TABLE SaasOutboundCallTasks IS 'SAAS平台外呼任务表';

CREATE TABLE SaasApiKeys (
    id VARCHAR(255) PRIMARY KEY,
    saas_enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    key_value_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(10) NOT NULL UNIQUE,
    description VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
    rate_limit_per_minute INT,
    permissions_json JSONB NOT NULL, -- Array of permission strings
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);
COMMENT ON TABLE SaasApiKeys IS 'SAAS API密钥表';

CREATE TABLE SaasSystemSettings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description VARCHAR(255),
    last_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasSystemSettings IS 'SAAS平台系统设置表';

CREATE TABLE SaasLlmSettings (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'primary',
    api_key VARCHAR(255) NOT NULL,
    api_endpoint VARCHAR(255) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasLlmSettings IS 'SAAS平台大语言模型设置表';


CREATE TABLE OutboundCallGroups (
    id VARCHAR(255) PRIMARY KEY,
    saas_enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE SET NULL,
    creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    member_count INT DEFAULT 0
);
COMMENT ON TABLE OutboundCallGroups IS '外呼组表 - SAAS/医生端通用';

CREATE TABLE OutboundCallGroupMembers (
    group_id VARCHAR(255) NOT NULL REFERENCES OutboundCallGroups(id) ON DELETE CASCADE,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, patient_user_id)
);
COMMENT ON TABLE OutboundCallGroupMembers IS '外呼组成员表 - SAAS/医生端通用';

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
COMMENT ON TABLE SaasScheduledTasks IS 'SAAS平台定时任务表';

CREATE TABLE SystemLogs (
    log_id SERIAL PRIMARY KEY, -- For PostgreSQL. Use BIGINT AUTO_INCREMENT for MySQL.
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    level VARCHAR(10) NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR', 'DEBUG', 'FATAL')),
    source VARCHAR(100),
    user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    context_json JSONB,
    ip_address VARCHAR(45)
);
COMMENT ON TABLE SystemLogs IS '系统日志表 - 通用';

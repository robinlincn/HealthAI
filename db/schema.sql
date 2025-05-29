
-- 核心用户与档案
-- 1. 用户表 (Users)
CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('patient', 'doctor', 'saas_admin', 'enterprise_admin')),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    avatar_url VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_approval', 'suspended', 'invited', 'disabled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMPTZ,
    saas_enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id) ON DELETE SET NULL,
    saas_department_id VARCHAR(255) REFERENCES SaasDepartments(id) ON DELETE SET NULL,
    employee_number VARCHAR(100),
    role_title VARCHAR(100),
    join_date DATE,
    system_role_id VARCHAR(255) REFERENCES SaasSystemRoles(id) ON DELETE SET NULL
);
COMMENT ON TABLE Users IS '存储所有系统用户的基本认证信息和通用属性。';
COMMENT ON COLUMN Users.id IS '用户ID (UUID或自定义字符串)';
COMMENT ON COLUMN Users.user_type IS '用户类型';
COMMENT ON COLUMN Users.email IS '邮箱 (登录用)';
COMMENT ON COLUMN Users.password_hash IS '哈希密码';
COMMENT ON COLUMN Users.name IS '姓名/昵称';
COMMENT ON COLUMN Users.phone_number IS '手机号';
COMMENT ON COLUMN Users.avatar_url IS '头像URL';
COMMENT ON COLUMN Users.status IS '账户状态';
COMMENT ON COLUMN Users.created_at IS '创建时间';
COMMENT ON COLUMN Users.updated_at IS '更新时间';
COMMENT ON COLUMN Users.last_login_at IS '最后登录时间';
COMMENT ON COLUMN Users.saas_enterprise_id IS '(外键) 所属SAAS企业ID (医生/企业员工)';
COMMENT ON COLUMN Users.saas_department_id IS '(外键) 所属SAAS部门ID (医生/企业员工)';
COMMENT ON COLUMN Users.employee_number IS '员工工号 (企业内)';
COMMENT ON COLUMN Users.role_title IS '职位/角色名称 (企业内)';
COMMENT ON COLUMN Users.join_date IS '入职日期 (企业内)';
COMMENT ON COLUMN Users.system_role_id IS '(外键) SAAS平台系统角色ID (saas_admin)';

-- 2. 病人档案表 (PatientProfiles)
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
    managing_doctor_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    membership_level_id VARCHAR(255) REFERENCES SaasMembershipLevels(id) ON DELETE SET NULL,
    points INT DEFAULT 0
);
COMMENT ON TABLE PatientProfiles IS '存储病人的详细个人信息和医疗背景。';
COMMENT ON COLUMN PatientProfiles.user_id IS '用户ID (主键, 外键)';
COMMENT ON COLUMN PatientProfiles.record_number IS '病案号';
COMMENT ON COLUMN PatientProfiles.gender IS '性别';
-- ... (继续为所有PatientProfiles字段添加中文注释) ...
COMMENT ON COLUMN PatientProfiles.managing_doctor_id IS '(外键)主管医生ID';
COMMENT ON COLUMN PatientProfiles.membership_level_id IS '(外键) 会员等级ID';
COMMENT ON COLUMN PatientProfiles.points IS '会员积分';


-- 3. 病人家族病史表 (PatientFamilyMedicalHistory)
CREATE TABLE PatientFamilyMedicalHistory (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    relative_type VARCHAR(50) NOT NULL CHECK (relative_type IN ('self', 'father', 'mother', 'paternal_grandparents', 'maternal_grandparents')),
    condition_name VARCHAR(100) NOT NULL,
    notes TEXT
);
COMMENT ON TABLE PatientFamilyMedicalHistory IS '存储病人的结构化家族病史。';
COMMENT ON COLUMN PatientFamilyMedicalHistory.id IS '记录ID';
COMMENT ON COLUMN PatientFamilyMedicalHistory.patient_user_id IS '(外键) 病人用户ID';
COMMENT ON COLUMN PatientFamilyMedicalHistory.relative_type IS '亲属关系';
COMMENT ON COLUMN PatientFamilyMedicalHistory.condition_name IS '疾病名称';
COMMENT ON COLUMN PatientFamilyMedicalHistory.notes IS '备注';

-- 4. 病人用药史表 (PatientMedicationHistory)
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
COMMENT ON TABLE PatientMedicationHistory IS '存储病人的详细用药记录。';
COMMENT ON COLUMN PatientMedicationHistory.id IS '用药记录ID';
-- ... (继续为PatientMedicationHistory字段添加注释) ...

-- 5. 紧急联系人表 (EmergencyContacts)
CREATE TABLE EmergencyContacts (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE EmergencyContacts IS '存储病人的紧急联系人信息。';
-- ... (继续为EmergencyContacts字段添加注释) ...

-- 6. 医生档案表 (DoctorProfiles)
CREATE TABLE DoctorProfiles (
    user_id VARCHAR(255) PRIMARY KEY REFERENCES Users(id) ON DELETE CASCADE,
    specialty VARCHAR(100),
    bio TEXT
);
COMMENT ON TABLE DoctorProfiles IS '存储医生特有的、非认证相关的额外信息。';
-- ... (继续为DoctorProfiles字段添加注释) ...

-- 健康数据与记录
-- 7. 健康数据记录表 (HealthDataRecords)
CREATE TABLE HealthDataRecords (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('blood_sugar', 'blood_pressure', 'weight', 'lipids', 'exercise', 'activity')),
    recorded_at TIMESTAMPTZ NOT NULL,
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE HealthDataRecords IS '存储各类健康监测数据。';
-- ... (继续为HealthDataRecords字段添加注释) ...

-- 8. 检查报告表 (ExaminationReports)
CREATE TABLE ExaminationReports (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    doctor_user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    report_name VARCHAR(255) NOT NULL,
    report_type VARCHAR(20) NOT NULL CHECK (report_type IN ('image', 'pdf', 'other')),
    file_url VARCHAR(255) NOT NULL,
    upload_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    report_date DATE
);
COMMENT ON TABLE ExaminationReports IS '存储病人上传的检查报告文件信息。';
-- ... (继续为ExaminationReports字段添加注释) ...

-- 9. 饮食记录表 (DietRecords)
CREATE TABLE DietRecords (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    recorded_at TIMESTAMPTZ NOT NULL,
    notes TEXT,
    total_calories INT,
    total_protein DECIMAL(10,2),
    total_carbs DECIMAL(10,2),
    total_fat DECIMAL(10,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE DietRecords IS '记录病人的膳食信息。';
-- ... (继续为DietRecords字段添加注释) ...

-- 10. 饮食记录条目表 (DietRecordItems)
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
COMMENT ON TABLE DietRecordItems IS '存储每餐饮食的具体食物条目。';
-- ... (继续为DietRecordItems字段添加注释) ...

-- 11. 食物数据库表 (FoodDatabase)
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
COMMENT ON TABLE FoodDatabase IS '存储食物的营养信息。';
-- ... (继续为FoodDatabase字段添加注释) ...

-- 互动与提醒
-- 12. 医患咨询表 (Consultations)
CREATE TABLE Consultations (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    doctor_user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending_reply', 'replied', 'closed', 'scheduled', 'pending_confirmation', 'completed', 'cancelled')),
    source VARCHAR(50) CHECK (source IN ('app', 'wechat_mini_program', 'wechat_personal', 'wechat_group')),
    attachments_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    doctor_reply_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reply_content TEXT
);
COMMENT ON TABLE Consultations IS '记录医患之间的咨询会话。';
-- ... (继续为Consultations字段添加注释) ...

-- 13. 咨询消息表 (ConsultationMessages)
CREATE TABLE ConsultationMessages (
    id VARCHAR(255) PRIMARY KEY,
    consultation_id VARCHAR(255) NOT NULL REFERENCES Consultations(id) ON DELETE CASCADE,
    sender_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    message_content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file', 'audio')),
    file_url VARCHAR(255),
    sent_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE ConsultationMessages IS '存储咨询会话中的具体消息。';
-- ... (继续为ConsultationMessages字段添加注释) ...

-- 14. 提醒表 (Reminders)
CREATE TABLE Reminders (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    reminder_type VARCHAR(50) NOT NULL CHECK (reminder_type IN ('medication', 'checkup', 'appointment', 'custom')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_datetime TIMESTAMPTZ NOT NULL,
    frequency_cron VARCHAR(100),
    is_enabled BOOLEAN DEFAULT TRUE,
    last_triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE Reminders IS '存储各类健康提醒。';
-- ... (继续为Reminders字段添加注释) ...

-- 15. 提醒执行记录表 (ReminderLogs)
CREATE TABLE ReminderLogs (
    id VARCHAR(255) PRIMARY KEY,
    reminder_id VARCHAR(255) NOT NULL REFERENCES Reminders(id) ON DELETE CASCADE,
    action_taken VARCHAR(20) NOT NULL CHECK (action_taken IN ('taken', 'skipped', 'done', 'missed')),
    action_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);
COMMENT ON TABLE ReminderLogs IS '记录提醒的执行情况。';
-- ... (继续为ReminderLogs字段添加注释) ...

-- 扩展功能 (病人端)
-- 16. 健康课程表 (HealthCourses)
CREATE TABLE HealthCourses (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    duration_text VARCHAR(100),
    image_url VARCHAR(255),
    content_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE HealthCourses IS '存储健康教育课程信息。';
-- ... (继续为HealthCourses字段添加注释) ...

-- 17. 病人课程报名表 (PatientCourseEnrollments)
CREATE TABLE PatientCourseEnrollments (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    course_id VARCHAR(255) NOT NULL REFERENCES HealthCourses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed'))
);
COMMENT ON TABLE PatientCourseEnrollments IS '记录病人参与课程的情况。';
-- ... (继续为PatientCourseEnrollments字段添加注释) ...

-- 18. 社区帖子表 (CommunityPosts)
CREATE TABLE CommunityPosts (
    id VARCHAR(255) PRIMARY KEY,
    author_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    likes_count INT DEFAULT 0
);
COMMENT ON TABLE CommunityPosts IS '存储社区中的帖子。';
-- ... (继续为CommunityPosts字段添加注释) ...

-- 19. 社区评论表 (CommunityComments)
CREATE TABLE CommunityComments (
    id VARCHAR(255) PRIMARY KEY,
    post_id VARCHAR(255) NOT NULL REFERENCES CommunityPosts(id) ON DELETE CASCADE,
    author_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    parent_comment_id VARCHAR(255) REFERENCES CommunityComments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE CommunityComments IS '存储对社区帖子的评论。';
-- ... (继续为CommunityComments字段添加注释) ...

-- 医生端特定功能
-- 20. 预约表 (Appointments)
CREATE TABLE Appointments (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    doctor_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    appointment_datetime TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 30,
    reason TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled_by_patient', 'cancelled_by_doctor', 'pending_confirmation')),
    notes_patient TEXT,
    notes_doctor TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE Appointments IS '管理医生和病人之间的预约。';
-- ... (继续为Appointments字段添加注释) ...

-- 21. 治疗方案表 (TreatmentPlans)
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE TreatmentPlans IS '存储医生为病人制定的治疗方案。';
-- ... (继续为TreatmentPlans字段添加注释) ...

-- 22. 治疗方案药物表 (TreatmentPlanMedications)
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
COMMENT ON TABLE TreatmentPlanMedications IS '存储治疗方案中包含的药物信息。';
-- ... (继续为TreatmentPlanMedications字段添加注释) ...

-- 23. 治疗建议记录表 (TreatmentAdvices)
CREATE TABLE TreatmentAdvices (
    id VARCHAR(255) PRIMARY KEY,
    patient_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    doctor_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    treatment_plan_id VARCHAR(255) REFERENCES TreatmentPlans(id) ON DELETE SET NULL,
    advice_content TEXT NOT NULL,
    advice_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT '待执行' CHECK (status IN ('待执行', '已执行', '已取消', 'pending', 'acknowledged', 'implemented', 'rejected')),
    patient_feedback_notes TEXT
);
COMMENT ON TABLE TreatmentAdvices IS '记录医生给出的具体治疗建议及病人反馈。';
-- ... (继续为TreatmentAdvices字段添加注释) ...

-- SAAS 管理后台表结构
-- 25. SAAS企业/医院表 (SaasEnterprises) - 表号接续，原表24是DoctorPatientMessages
CREATE TABLE SaasEnterprises (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    contact_person VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    contact_phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('active', 'inactive', 'pending_approval', 'suspended')),
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_resources_json JSONB,
    current_users_count INT DEFAULT 0,
    current_patients_count INT DEFAULT 0,
    notes TEXT,
    service_package_id VARCHAR(255) REFERENCES SaasServicePackages(id) ON DELETE SET NULL
);
COMMENT ON TABLE SaasEnterprises IS '管理SAAS平台上的企业/医院账户。';
-- ... (继续为SaasEnterprises字段添加注释) ...

-- 26. SAAS企业部门表 (SaasDepartments)
CREATE TABLE SaasDepartments (
    id VARCHAR(255) PRIMARY KEY,
    saas_enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    parent_department_id VARCHAR(255) REFERENCES SaasDepartments(id) ON DELETE SET NULL,
    head_employee_user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    description TEXT,
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasDepartments IS '管理企业内部的部门/科室结构。';
-- ... (继续为SaasDepartments字段添加注释) ...

-- 27. SAAS平台系统角色表 (SaasSystemRoles)
CREATE TABLE SaasSystemRoles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions_json JSONB NOT NULL
);
COMMENT ON TABLE SaasSystemRoles IS '定义SAAS平台管理员的角色。';
-- ... (继续为SaasSystemRoles字段添加注释) ...

-- 28. SAAS服务包表 (SaasServicePackages)
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasServicePackages IS '定义平台提供的服务包。';
-- ... (继续为SaasServicePackages字段添加注释) ...

-- 29. SAAS服务订单表 (SaasOrders)
CREATE TABLE SaasOrders (
    id VARCHAR(255) PRIMARY KEY,
    saas_enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    saas_service_package_id VARCHAR(255) NOT NULL REFERENCES SaasServicePackages(id) ON DELETE RESTRICT,
    order_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'processing')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'CNY',
    transaction_id VARCHAR(255) UNIQUE,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'annually', 'one-time')),
    renewal_date DATE,
    invoice_number VARCHAR(100),
    notes TEXT
);
COMMENT ON TABLE SaasOrders IS '记录企业购买服务包的订单。';
-- ... (继续为SaasOrders字段添加注释) ...

-- 30. SAAS平台连接表 (SaasPlatformConnections)
CREATE TABLE SaasPlatformConnections (
    id VARCHAR(255) PRIMARY KEY,
    enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id),
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('wechat_personal_bot', 'wechat_enterprise_app', 'other')),
    account_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('connected', 'disconnected', 'error', 'requires_reauth', 'pending_setup')),
    last_sync_at TIMESTAMPTZ,
    associated_employee_id VARCHAR(255) REFERENCES Users(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasPlatformConnections IS 'SAAS平台连接表 - 如微信机器人。';
-- ... (继续为SaasPlatformConnections字段添加注释) ...

-- 31. SAAS社群组表 (SaasCommunityGroups)
CREATE TABLE SaasCommunityGroups (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id),
    managing_employee_id VARCHAR(255) REFERENCES Users(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('personal_wechat_group', 'enterprise_wechat_group', 'other_platform_group')),
    platform_group_id VARCHAR(255) UNIQUE,
    description TEXT,
    member_patient_ids_json JSONB,
    patient_count INT DEFAULT 0,
    platform_connection_id VARCHAR(255) REFERENCES SaasPlatformConnections(id),
    connection_status VARCHAR(50) NOT NULL DEFAULT 'not_monitored' CHECK (connection_status IN ('active_sync', 'inactive_sync', 'error_sync', 'not_monitored')),
    last_log_sync_at TIMESTAMPTZ,
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tags_json JSONB
);
COMMENT ON TABLE SaasCommunityGroups IS 'SAAS社群组表 - 如微信群。';
-- ... (继续为SaasCommunityGroups字段添加注释) ...

-- 32. SAAS社群消息日志表 (SaasCommunityMessageLogs)
CREATE TABLE SaasCommunityMessageLogs (
    id VARCHAR(255) PRIMARY KEY,
    community_group_id VARCHAR(255) NOT NULL REFERENCES SaasCommunityGroups(id),
    platform VARCHAR(50) NOT NULL,
    platform_group_id_external VARCHAR(255),
    platform_message_id_external VARCHAR(255) NOT NULL UNIQUE,
    sender_platform_id VARCHAR(255) NOT NULL,
    sender_saas_user_id VARCHAR(255) REFERENCES Users(id),
    sender_name_display VARCHAR(255) NOT NULL,
    message_content TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('text', 'image', 'file', 'voice', 'system_notification', 'video')),
    file_url VARCHAR(255),
    timestamp TIMESTAMPTZ NOT NULL,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_bot_message BOOLEAN DEFAULT FALSE,
    metadata_json JSONB
);
COMMENT ON TABLE SaasCommunityMessageLogs IS 'SAAS社群消息日志表。';
-- ... (继续为SaasCommunityMessageLogs字段添加注释) ...

-- 33. SAAS SOP服务配置表 (SaasSopServices)
CREATE TABLE SaasSopServices (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Coze', 'Dify', 'Other')),
    api_endpoint VARCHAR(255) NOT NULL,
    api_key VARCHAR(512),
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
    parameters_json JSONB,
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_call_at TIMESTAMPTZ,
    call_count INT DEFAULT 0,
    error_count INT DEFAULT 0
);
COMMENT ON TABLE SaasSopServices IS '管理 Coze, Dify 等工作流API的配置。';
-- ... (继续为SaasSopServices字段添加注释) ...

-- 34. SAAS AI工作流API配置表 (SaasAiWorkflowApiConfigs)
CREATE TABLE SaasAiWorkflowApiConfigs (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Dify', 'Coze', 'Other')),
    api_endpoint VARCHAR(255) NOT NULL,
    api_key VARCHAR(512),
    parameters_json JSONB,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasAiWorkflowApiConfigs IS '存储Dify/Coze等AI工作流API配置。';
-- ... (继续为SaasAiWorkflowApiConfigs字段添加注释) ...

-- 35. SAAS平台外呼任务表 (SaasOutboundCallTasks)
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
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    scheduled_time TIMESTAMPTZ,
    call_content_summary TEXT,
    sop_service_id VARCHAR(255) REFERENCES SaasSopServices(id) ON DELETE SET NULL,
    assigned_to_employee_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    call_count_total INT DEFAULT 0,
    call_count_success INT DEFAULT 0,
    completion_status VARCHAR(50) CHECK (completion_status IN ('success_all', 'partial_success', 'failed_all', 'not_applicable')),
    notes TEXT
);
COMMENT ON TABLE SaasOutboundCallTasks IS '管理平台级的外呼任务。';
-- ... (继续为SaasOutboundCallTasks字段添加注释) ...

-- 36. SAAS API密钥表 (SaasApiKeys)
CREATE TABLE SaasApiKeys (
    id VARCHAR(255) PRIMARY KEY,
    saas_enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    key_value_hash VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(10) NOT NULL UNIQUE,
    description VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
    rate_limit_per_minute INT,
    permissions_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ
);
COMMENT ON TABLE SaasApiKeys IS '管理平台对外提供的API密钥。';
-- ... (继续为SaasApiKeys字段添加注释) ...

-- 37. SAAS平台系统设置表 (SaasSystemSettings)
CREATE TABLE SaasSystemSettings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description VARCHAR(255),
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasSystemSettings IS '键值对形式存储平台全局设置。';
-- ... (继续为SaasSystemSettings字段添加注释) ...

-- 38. SAAS平台大语言模型设置表 (SaasLlmSettings)
CREATE TABLE SaasLlmSettings (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'primary_llm_config',
    api_key VARCHAR(512) NOT NULL,
    api_endpoint VARCHAR(255) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasLlmSettings IS '存储核心LLM的配置信息。';
-- ... (继续为SaasLlmSettings字段添加注释) ...

-- 39. 外呼组表 (OutboundCallGroups) - SAAS/医生端通用
CREATE TABLE OutboundCallGroups (
    id VARCHAR(255) PRIMARY KEY,
    saas_enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by_user_id VARCHAR(255) NOT NULL REFERENCES Users(id) ON DELETE SET NULL,
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    member_count INT DEFAULT 0
);
COMMENT ON TABLE OutboundCallGroups IS '用于SAAS平台或医生端管理外呼的病人组/员工组。';
-- ... (继续为OutboundCallGroups字段添加注释) ...

-- 40. 外呼组成员表 (OutboundCallGroupMembers) - SAAS/医生端通用
CREATE TABLE OutboundCallGroupMembers (
    group_id VARCHAR(255) NOT NULL REFERENCES OutboundCallGroups(id) ON DELETE CASCADE,
    target_id VARCHAR(255) NOT NULL,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('patient', 'employee')),
    added_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, target_id, target_type)
);
COMMENT ON TABLE OutboundCallGroupMembers IS '外呼组与目标(病人/员工)的多对多关联。';
-- ... (继续为OutboundCallGroupMembers字段添加注释) ...

-- 41. SAAS平台定时任务表 (SaasScheduledTasks)
CREATE TABLE SaasScheduledTasks (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('data_backup', 'report_generation', 'notification_push', 'system_cleanup', 'external_sync')),
    cron_expression VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('enabled', 'disabled', 'running', 'error')),
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    last_run_status VARCHAR(50),
    description TEXT,
    job_handler_identifier VARCHAR(255) NOT NULL
);
COMMENT ON TABLE SaasScheduledTasks IS '管理平台后台运行的定时任务。';
-- ... (继续为SaasScheduledTasks字段添加注释) ...

-- 42. 系统日志表 (SystemLogs) - 通用
CREATE TABLE SystemLogs (
    log_id BIGSERIAL PRIMARY KEY, -- PostgreSQL specific, use BIGINT AUTO_INCREMENT for MySQL
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    level VARCHAR(10) NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR', 'DEBUG', 'FATAL')),
    source VARCHAR(100),
    user_id VARCHAR(255) REFERENCES Users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    context_json JSONB,
    ip_address VARCHAR(45)
);
COMMENT ON TABLE SystemLogs IS '记录系统操作、错误等日志信息。';
-- ... (继续为SystemLogs字段添加注释) ...

-- 在线商城 (SAAS 功能模块)
-- 43. 商品分类表 (SaasProductCategories)
CREATE TABLE SaasProductCategories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id),
    parent_id VARCHAR(255) REFERENCES SaasProductCategories(id),
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    product_count INT DEFAULT 0
);
COMMENT ON TABLE SaasProductCategories IS '管理在线商城的商品分类。';
-- ... (继续为SaasProductCategories字段添加注释) ...

-- 44. 商品表 (SaasProducts)
CREATE TABLE SaasProducts (
    id VARCHAR(255) PRIMARY KEY,
    enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(255) REFERENCES SaasProductCategories(id),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'draft', 'archived')),
    images_json JSONB,
    sku VARCHAR(100) UNIQUE,
    tags_json JSONB,
    assigned_employee_ids_json JSONB,
    is_hot_sale BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    is_doctor_recommended BOOLEAN DEFAULT FALSE,
    discount_price DECIMAL(10,2) CHECK (discount_price >= 0),
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasProducts IS '管理在线商城中的商品信息。';
-- ... (继续为SaasProducts字段添加注释) ...

-- 45. 商城订单表 (SaasMallOrders)
CREATE TABLE SaasMallOrders (
    id VARCHAR(255) PRIMARY KEY,
    order_number VARCHAR(100) NOT NULL UNIQUE,
    enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id),
    customer_user_id VARCHAR(255) NOT NULL REFERENCES Users(id),
    customer_name VARCHAR(100) NOT NULL,
    customer_contact VARCHAR(100),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'cancelled_user', 'cancelled_admin', 'refund_pending', 'refunded', 'return_requested', 'return_approved', 'return_completed')),
    order_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    payment_transaction_id VARCHAR(255),
    shipping_address_json JSONB,
    shipping_method VARCHAR(100),
    shipping_fee DECIMAL(10,2) DEFAULT 0.00,
    tracking_number VARCHAR(100),
    carrier VARCHAR(100),
    notes TEXT,
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    salesperson_employee_id VARCHAR(255) REFERENCES Users(id),
    salesperson_name VARCHAR(100)
);
COMMENT ON TABLE SaasMallOrders IS '记录在线商城的商品订单。';
-- ... (继续为SaasMallOrders字段添加注释) ...

-- 46. 商城订单商品条目表 (SaasMallOrderItems)
CREATE TABLE SaasMallOrderItems (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL REFERENCES SaasMallOrders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) NOT NULL REFERENCES SaasProducts(id),
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_order DECIMAL(10,2) NOT NULL
);
COMMENT ON TABLE SaasMallOrderItems IS '记录订单中包含的具体商品。';
-- ... (继续为SaasMallOrderItems字段添加注释) ...

-- 47. 会员等级表 (SaasMembershipLevels)
CREATE TABLE SaasMembershipLevels (
    id VARCHAR(255) PRIMARY KEY,
    enterprise_id VARCHAR(255) NOT NULL REFERENCES SaasEnterprises(id),
    name VARCHAR(100) NOT NULL,
    min_points INT DEFAULT 0,
    discount_percentage DECIMAL(5,4) CHECK (discount_percentage BETWEEN 0 AND 1),
    description TEXT,
    permissions_json JSONB,
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasMembershipLevels IS '定义企业的会员等级体系。';
-- ... (继续为SaasMembershipLevels字段添加注释) ...

-- 48. 促销活动表 (SaasPromotions)
CREATE TABLE SaasPromotions (
    id VARCHAR(255) PRIMARY KEY,
    enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('full_reduction', 'discount', 'buy_x_get_y', 'limited_time_offer')),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'scheduled', 'expired')),
    actions_json JSONB,
    conditions_json JSONB,
    applicable_products_json JSONB,
    usage_limit INT,
    total_used INT DEFAULT 0
);
COMMENT ON TABLE SaasPromotions IS '管理商城的促销活动。';
-- ... (继续为SaasPromotions字段添加注释) ...

-- 49. 优惠券表 (SaasCoupons)
CREATE TABLE SaasCoupons (
    id VARCHAR(255) PRIMARY KEY,
    enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('fixed_amount', 'percentage')),
    value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2),
    valid_from TIMESTAMPTZ NOT NULL,
    valid_to TIMESTAMPTZ NOT NULL,
    max_uses INT,
    uses_per_user INT,
    total_used INT DEFAULT 0,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'expired', 'used_up')),
    applicable_products_json JSONB,
    applicable_categories_json JSONB
);
COMMENT ON TABLE SaasCoupons IS '管理优惠券信息。';
-- ... (继续为SaasCoupons字段添加注释) ...

-- 50. 广告表 (SaasAdvertisements)
CREATE TABLE SaasAdvertisements (
    id VARCHAR(255) PRIMARY KEY,
    enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id),
    name VARCHAR(255) NOT NULL,
    ad_slot_id VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video', 'html')),
    asset_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'scheduled', 'expired')),
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0
);
COMMENT ON TABLE SaasAdvertisements IS '管理商城广告内容。';
-- ... (继续为SaasAdvertisements字段添加注释) ...

-- 51. 文件管理表 (SaasManagedFiles)
CREATE TABLE SaasManagedFiles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'pdf', 'doc', 'audio', 'video', 'other')),
    mime_type VARCHAR(100) NOT NULL,
    size_kb INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    upload_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uploader_user_id VARCHAR(255) REFERENCES Users(id),
    enterprise_id VARCHAR(255) REFERENCES SaasEnterprises(id),
    category_id VARCHAR(255) REFERENCES SaasFileCategories(id),
    description TEXT
);
COMMENT ON TABLE SaasManagedFiles IS '管理SAAS平台上传的各类文件资源。';
-- ... (继续为SaasManagedFiles字段添加注释) ...

-- 52. 文件分类表 (SaasFileCategories)
CREATE TABLE SaasFileCategories (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    creation_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE SaasFileCategories IS '管理文件的分类标签。';
-- ... (继续为SaasFileCategories字段添加注释) ...

-- Indexes (示例 - 根据实际查询需求添加更多)
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_patientprofiles_managing_doctor_id ON PatientProfiles(managing_doctor_id);
CREATE INDEX idx_healthdatarecords_patient_type_time ON HealthDataRecords(patient_user_id, record_type, recorded_at);
CREATE INDEX idx_consultations_patient_doctor_status ON Consultations(patient_user_id, doctor_user_id, status);
CREATE INDEX idx_appointments_doctor_datetime ON Appointments(doctor_user_id, appointment_datetime);
CREATE INDEX idx_saasenterprises_name ON SaasEnterprises(name);
CREATE INDEX idx_saasdepartments_enterprise_id ON SaasDepartments(saas_enterprise_id);
CREATE INDEX idx_saasorders_enterprise_package ON SaasOrders(saas_enterprise_id, saas_service_package_id);
CREATE INDEX idx_saasproducts_enterprise_category ON SaasProducts(enterprise_id, category_id);
CREATE INDEX idx_saasmallorders_customer_enterprise ON SaasMallOrders(customer_user_id, enterprise_id);


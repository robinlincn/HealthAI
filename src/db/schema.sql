-- SQL Schema for AI Chronic Disease Management System
-- Note: ENUMs are represented as VARCHAR with CHECK constraints.
-- Note: `ON UPDATE CURRENT_TIMESTAMP` is MySQL-specific. For PostgreSQL, triggers would be needed for `updated_at`.
-- Note: JSON columns are represented as TEXT for broader compatibility, but native JSON types are preferred if available.

-- SAAS平台相关表 (优先创建，因为Users表可能依赖SaasEnterprises)

-- 23. `SaasEnterprises` (SAAS企业/医院表)
CREATE TABLE SaasEnterprises (
    id VARCHAR(255) PRIMARY KEY, -- 企业ID
    name VARCHAR(255) NOT NULL UNIQUE, -- 企业名称
    contact_person VARCHAR(100) NOT NULL, -- 联系人
    contact_email VARCHAR(255) NOT NULL UNIQUE, -- 联系邮箱
    contact_phone VARCHAR(20) NOT NULL, -- 联系电话
    address VARCHAR(255), -- 地址
    status VARCHAR(20) NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('active', 'inactive', 'pending_approval', 'suspended')), -- 账户状态
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建日期
    max_users INTEGER NOT NULL, -- 分配最大用户数
    max_storage_gb INTEGER NOT NULL, -- 分配最大存储空间 (GB)
    max_patients INTEGER NOT NULL, -- 分配最大病人额度
    current_users_count INTEGER DEFAULT 0, -- 当前用户数 (员工)
    current_patients_count INTEGER DEFAULT 0, -- 当前病人数量
    notes TEXT, -- 备注
    service_package_id VARCHAR(255) -- (外键) 订阅的服务包ID (FK to SaasServicePackages.id to be added later or ensure SaasServicePackages is created first)
);

-- 28. `SaasServicePackages` (SAAS服务包表)
CREATE TABLE SaasServicePackages (
    id VARCHAR(255) PRIMARY KEY, -- 服务包ID
    name VARCHAR(255) NOT NULL UNIQUE, -- 服务包名称
    type VARCHAR(10) NOT NULL CHECK (type IN ('basic', 'standard', 'premium', 'custom')), -- 类型
    price_monthly DECIMAL(10,2) NOT NULL, -- 月度价格 (元)
    price_annually DECIMAL(10,2), -- 年度价格 (元)
    features_json TEXT NOT NULL, -- 功能特性列表JSON (TEXT for JSON)
    highlights TEXT, -- 亮点说明
    max_users_limit INTEGER NOT NULL, -- 此包最大用户数
    max_storage_gb_limit INTEGER NOT NULL, -- 此包最大存储 (GB)
    max_patients_limit INTEGER NOT NULL, -- 此包最大病人额度
    is_enabled BOOLEAN DEFAULT TRUE, -- 是否启用销售
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 创建时间
);

-- Add FK for SaasEnterprises.service_package_id
ALTER TABLE SaasEnterprises
ADD CONSTRAINT fk_saasenterprises_service_package
FOREIGN KEY (service_package_id) REFERENCES SaasServicePackages(id) ON DELETE SET NULL ON UPDATE CASCADE;


-- 核心用户与档案

-- 1. `Users` (用户表 - 通用)
CREATE TABLE Users (
    id VARCHAR(255) PRIMARY KEY, -- 用户ID
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('patient', 'doctor', 'saas_admin')), -- 用户类型
    email VARCHAR(255) UNIQUE NOT NULL, -- 邮箱 (登录用)
    password_hash VARCHAR(255) NOT NULL, -- 哈希密码
    name VARCHAR(100) NOT NULL, -- 姓名
    phone_number VARCHAR(20) UNIQUE, -- 手机号
    avatar_url VARCHAR(255), -- 头像URL
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_approval', 'suspended')), -- 账户状态
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- MySQL: ON UPDATE CURRENT_TIMESTAMP, PostgreSQL needs trigger
    last_login_at TIMESTAMP, -- 最后登录时间
    saas_enterprise_id VARCHAR(255), -- (外键) 所属SAAS企业ID (医生/企业管理员)
    FOREIGN KEY (saas_enterprise_id) REFERENCES SaasEnterprises(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 2. `PatientProfiles` (病人档案表)
CREATE TABLE PatientProfiles (
    user_id VARCHAR(255) PRIMARY KEY, -- 用户ID
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')), -- 性别
    date_of_birth DATE, -- 出生日期
    address VARCHAR(255), -- 家庭住址
    blood_type VARCHAR(10) CHECK (blood_type IN ('A', 'B', 'O', 'AB', 'unknown')), -- 血型
    marital_status VARCHAR(15) CHECK (marital_status IN ('unmarried', 'married', 'divorced', 'widowed', 'other')), -- 婚姻状况
    occupation VARCHAR(100), -- 职业
    education_level VARCHAR(100), -- 文化程度
    primary_diagnosis TEXT, -- 主要诊断
    past_medical_history TEXT, -- 既往病史
    family_medical_history TEXT, -- 家族病史 (TEXT for JSON)
    allergies TEXT, -- 过敏史 (TEXT for JSON)
    current_symptoms TEXT, -- 当前症状 (TEXT for JSON)
    other_medical_info TEXT, -- 其他医疗信息
    health_goals TEXT, -- 健康目标 (TEXT for JSON)
    managing_doctor_id VARCHAR(255), -- (外键)主管医生ID
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (managing_doctor_id) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 3. `EmergencyContacts` (紧急联系人表)
CREATE TABLE EmergencyContacts (
    id VARCHAR(255) PRIMARY KEY, -- 紧急联系人ID
    patient_user_id VARCHAR(255) NOT NULL, -- (外键) 病人用户ID
    name VARCHAR(100) NOT NULL, -- 联系人姓名
    relationship VARCHAR(50) NOT NULL, -- 与病人关系
    phone_number VARCHAR(20) NOT NULL, -- 联系人电话
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    FOREIGN KEY (patient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. `DoctorProfiles` (医生档案表)
CREATE TABLE DoctorProfiles (
    user_id VARCHAR(255) PRIMARY KEY, -- 用户ID
    specialty VARCHAR(100), -- 专业/科室
    hospital_affiliation VARCHAR(255), -- 所属医院/机构 (SAAS模式下可能关联企业表)
    department VARCHAR(100), -- 院内部门
    years_of_experience INTEGER, -- 执业年限
    license_number VARCHAR(100), -- 执业医师编号
    bio TEXT, -- 个人简介/擅长
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 健康数据与记录

-- 5. `HealthDataRecords` (健康数据记录表)
CREATE TABLE HealthDataRecords (
    id VARCHAR(255) PRIMARY KEY, -- 记录ID
    patient_user_id VARCHAR(255) NOT NULL, -- (外键) 病人用户ID
    record_type VARCHAR(20) NOT NULL CHECK (record_type IN ('blood_sugar', 'blood_pressure', 'weight', 'lipids', 'exercise')), -- 记录类型
    recorded_at TIMESTAMP NOT NULL, -- 记录时间
    value1 DECIMAL(10,2), -- 数据值1 (血糖, 收缩压等)
    value2 DECIMAL(10,2), -- 数据值2 (舒张压等)
    value3 DECIMAL(10,2), -- 数据值3 (心率等)
    value4 DECIMAL(10,2), -- 数据值4 (LDL等)
    unit1 VARCHAR(20), -- 单位1
    text_value VARCHAR(255), -- 文本值 (如运动类型)
    notes TEXT, -- 备注 (餐前/餐后, 运动详情)
    source VARCHAR(15) DEFAULT 'manual' CHECK (source IN ('manual', 'device_sync')), -- 数据来源
    device_id VARCHAR(100), -- 设备ID (若同步)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    FOREIGN KEY (patient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. `ExaminationReports` (检查报告表)
CREATE TABLE ExaminationReports (
    id VARCHAR(255) PRIMARY KEY, -- 报告ID
    patient_user_id VARCHAR(255) NOT NULL, -- (外键) 病人用户ID
    doctor_user_id VARCHAR(255), -- (外键) 上传医生ID
    report_name VARCHAR(255) NOT NULL, -- 报告名称
    report_type VARCHAR(10) NOT NULL CHECK (report_type IN ('image', 'pdf', 'other')), -- 文件类型
    file_url VARCHAR(255) NOT NULL, -- 文件存储URL
    upload_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 上传日期
    description TEXT, -- 报告描述
    report_date DATE, -- 报告实际检查日期
    FOREIGN KEY (patient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (doctor_user_id) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 9. `FoodDatabase` (食物数据库表)
CREATE TABLE FoodDatabase (
    id VARCHAR(255) PRIMARY KEY, -- 食物ID
    name VARCHAR(255) NOT NULL UNIQUE, -- 食物名称
    calories_per_100g INTEGER, -- 每100克热量
    protein_per_100g DECIMAL(10,2), -- 每100克蛋白质
    carbs_per_100g DECIMAL(10,2), -- 每100克碳水
    fat_per_100g DECIMAL(10,2), -- 每100克脂肪
    unit_description VARCHAR(50) DEFAULT '100g', -- 单位描述
    created_by_user_id VARCHAR(255), -- (外键) 创建用户ID
    FOREIGN KEY (created_by_user_id) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 7. `DietRecords` (饮食记录表)
CREATE TABLE DietRecords (
    id VARCHAR(255) PRIMARY KEY, -- 记录ID
    patient_user_id VARCHAR(255) NOT NULL, -- (外键) 病人用户ID
    meal_type VARCHAR(10) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')), -- 膳食类型
    recorded_at TIMESTAMP NOT NULL, -- 记录时间
    notes TEXT, -- 备注
    total_calories INTEGER, -- 总热量 (千卡) (计算得出)
    total_protein DECIMAL(10,2), -- 总蛋白质 (克) (计算得出)
    total_carbs DECIMAL(10,2), -- 总碳水化合物 (克) (计算得出)
    total_fat DECIMAL(10,2), -- 总脂肪 (克) (计算得出)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    FOREIGN KEY (patient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 8. `DietRecordItems` (饮食记录条目表)
CREATE TABLE DietRecordItems (
    id VARCHAR(255) PRIMARY KEY, -- 条目ID
    diet_record_id VARCHAR(255) NOT NULL, -- (外键) 饮食记录ID
    food_name VARCHAR(255) NOT NULL, -- 食物名称
    quantity_description VARCHAR(100) NOT NULL, -- 份量描述 (例如: 1碗)
    calories INTEGER, -- 热量 (千卡)
    protein DECIMAL(10,2), -- 蛋白质 (克)
    carbs DECIMAL(10,2), -- 碳水化合物 (克)
    fat DECIMAL(10,2), -- 脂肪 (克)
    food_database_id VARCHAR(255), -- (外键) 食物库条目ID
    FOREIGN KEY (diet_record_id) REFERENCES DietRecords(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (food_database_id) REFERENCES FoodDatabase(id) ON DELETE SET NULL ON UPDATE CASCADE
);


-- 互动与提醒

-- 10. `Consultations` (医患咨询表)
CREATE TABLE Consultations (
    id VARCHAR(255) PRIMARY KEY, -- 咨询ID
    patient_user_id VARCHAR(255) NOT NULL, -- (外键) 病人用户ID
    doctor_user_id VARCHAR(255), -- (外键) 医生用户ID (可系统分配)
    question TEXT NOT NULL, -- 病人问题
    status VARCHAR(25) NOT NULL CHECK (status IN ('pending_reply', 'replied', 'closed', 'scheduled', 'pending_confirmation')), -- 状态
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 病人发起时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- MySQL: ON UPDATE CURRENT_TIMESTAMP
    FOREIGN KEY (patient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (doctor_user_id) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 11. `ConsultationMessages` (咨询消息表)
CREATE TABLE ConsultationMessages (
    id VARCHAR(255) PRIMARY KEY, -- 消息ID
    consultation_id VARCHAR(255) NOT NULL, -- (外键) 咨询ID
    sender_user_id VARCHAR(255) NOT NULL, -- (外键) 发送者ID
    message_content TEXT NOT NULL, -- 消息内容
    message_type VARCHAR(10) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file')), -- 消息类型
    file_url VARCHAR(255), -- 文件URL (非文本消息)
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 发送时间
    FOREIGN KEY (consultation_id) REFERENCES Consultations(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (sender_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 12. `Reminders` (提醒表 - 通用)
CREATE TABLE Reminders (
    id VARCHAR(255) PRIMARY KEY, -- 提醒ID
    patient_user_id VARCHAR(255) NOT NULL, -- (外键) 病人用户ID
    reminder_type VARCHAR(15) NOT NULL CHECK (reminder_type IN ('medication', 'checkup', 'appointment', 'custom')), -- 提醒类型
    title VARCHAR(255) NOT NULL, -- 提醒标题
    description TEXT, -- 提醒描述
    due_datetime TIMESTAMP NOT NULL, -- 到期/提醒时间
    frequency VARCHAR(100), -- 重复频率 (如: daily, 0 8 * * 1)
    is_enabled BOOLEAN DEFAULT TRUE, -- 是否启用
    last_triggered_at TIMESTAMP, -- 上次触发时间
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    FOREIGN KEY (patient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 13. `ReminderLogs` (提醒执行记录表)
CREATE TABLE ReminderLogs (
    id VARCHAR(255) PRIMARY KEY, -- 记录ID
    reminder_id VARCHAR(255) NOT NULL, -- (外键) 提醒ID
    action_taken VARCHAR(10) NOT NULL CHECK (action_taken IN ('taken', 'skipped', 'done', 'missed')), -- 执行动作
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 执行时间
    notes TEXT, -- 备注
    FOREIGN KEY (reminder_id) REFERENCES Reminders(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 扩展功能

-- 14. `HealthCourses` (健康课程表)
CREATE TABLE HealthCourses (
    id VARCHAR(255) PRIMARY KEY, -- 课程ID
    title VARCHAR(255) NOT NULL, -- 课程标题
    description TEXT, -- 课程描述
    category VARCHAR(100), -- 课程分类
    duration_text VARCHAR(100), -- 课程时长文本
    image_url VARCHAR(255), -- 课程封面图URL
    content_url VARCHAR(255), -- 课程内容URL (或关联内容表)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 创建时间
);

-- 15. `PatientCourseEnrollments` (病人课程报名表)
CREATE TABLE PatientCourseEnrollments (
    id VARCHAR(255) PRIMARY KEY, -- 报名ID
    patient_user_id VARCHAR(255) NOT NULL, -- (外键) 病人ID
    course_id VARCHAR(255) NOT NULL, -- (外键) 课程ID
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 报名时间
    progress_percentage INTEGER DEFAULT 0, -- 学习进度 (%)
    status VARCHAR(15) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed')), -- 学习状态
    FOREIGN KEY (patient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (course_id) REFERENCES HealthCourses(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 16. `CommunityPosts` (社区帖子表)
CREATE TABLE CommunityPosts (
    id VARCHAR(255) PRIMARY KEY, -- 帖子ID
    author_user_id VARCHAR(255) NOT NULL, -- (外键) 作者ID
    content TEXT NOT NULL, -- 帖子内容
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 发布时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- MySQL: ON UPDATE CURRENT_TIMESTAMP
    likes_count INTEGER DEFAULT 0, -- 点赞数
    FOREIGN KEY (author_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 17. `CommunityComments` (社区评论表)
CREATE TABLE CommunityComments (
    id VARCHAR(255) PRIMARY KEY, -- 评论ID
    post_id VARCHAR(255) NOT NULL, -- (外键) 帖子ID
    author_user_id VARCHAR(255) NOT NULL, -- (外键) 评论者ID
    parent_comment_id VARCHAR(255), -- (外键) 父评论ID
    content TEXT NOT NULL, -- 评论内容
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 发布时间
    FOREIGN KEY (post_id) REFERENCES CommunityPosts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (author_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES CommunityComments(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 医生端特定功能

-- 18. `Appointments` (预约表)
CREATE TABLE Appointments (
    id VARCHAR(255) PRIMARY KEY, -- 预约ID
    patient_user_id VARCHAR(255) NOT NULL, -- (外键) 病人ID
    doctor_user_id VARCHAR(255) NOT NULL, -- (外键) 医生ID
    appointment_datetime TIMESTAMP NOT NULL, -- 预约日期时间
    duration_minutes INTEGER DEFAULT 30, -- 预约时长(分钟)
    reason TEXT, -- 预约事由
    status VARCHAR(25) NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled_by_patient', 'cancelled_by_doctor', 'pending_confirmation')), -- 预约状态
    notes_patient TEXT, -- 病人备注
    notes_doctor TEXT, -- 医生备注
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- MySQL: ON UPDATE CURRENT_TIMESTAMP
    FOREIGN KEY (patient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (doctor_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 19. `TreatmentPlans` (治疗方案表)
CREATE TABLE TreatmentPlans (
    id VARCHAR(255) PRIMARY KEY, -- 方案ID
    patient_user_id VARCHAR(255) NOT NULL, -- (外键) 病人ID
    doctor_user_id VARCHAR(255) NOT NULL, -- (外键) 制定医生ID
    plan_name VARCHAR(255) DEFAULT '默认治疗方案', -- 方案名称
    start_date DATE NOT NULL, -- 开始日期
    end_date DATE, -- 结束日期 (可选)
    short_term_goals TEXT, -- 短期目标
    long_term_goals TEXT, -- 长期目标
    lifestyle_adjustments TEXT, -- 生活方式调整建议
    is_active BOOLEAN DEFAULT TRUE, -- 是否当前激活方案
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- MySQL: ON UPDATE CURRENT_TIMESTAMP
    FOREIGN KEY (patient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (doctor_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 20. `TreatmentPlanMedications` (治疗方案药物表)
CREATE TABLE TreatmentPlanMedications (
    id VARCHAR(255) PRIMARY KEY, -- ID
    treatment_plan_id VARCHAR(255) NOT NULL, -- (外键) 治疗方案ID
    drug_name VARCHAR(255) NOT NULL, -- 药物名称
    dosage VARCHAR(100) NOT NULL, -- 剂量
    frequency VARCHAR(100) NOT NULL, -- 服用频率
    notes TEXT, -- 服用备注
    start_date DATE NOT NULL, -- 开始服用日期
    end_date DATE, -- 结束服用日期 (可选)
    FOREIGN KEY (treatment_plan_id) REFERENCES TreatmentPlans(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 21. `TreatmentAdvices` (治疗建议记录表)
CREATE TABLE TreatmentAdvices (
    id VARCHAR(255) PRIMARY KEY, -- 建议ID
    patient_user_id VARCHAR(255) NOT NULL, -- (外键) 病人ID
    doctor_user_id VARCHAR(255) NOT NULL, -- (外键) 建议医生ID
    treatment_plan_id VARCHAR(255), -- (外键) 关联治疗方案ID
    advice_content TEXT NOT NULL, -- 建议内容
    advice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 建议发出时间
    patient_feedback_status VARCHAR(15) DEFAULT 'pending' CHECK (patient_feedback_status IN ('pending', 'acknowledged', 'implemented', 'rejected')), -- 病人执行状态/反馈
    patient_feedback_notes TEXT, -- 病人反馈备注
    FOREIGN KEY (patient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (doctor_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (treatment_plan_id) REFERENCES TreatmentPlans(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- SAAS 管理后台表结构 (继续)

-- 24. `SaasDepartments` (SAAS企业部门表)
CREATE TABLE SaasDepartments (
    id VARCHAR(255) PRIMARY KEY, -- 部门ID
    saas_enterprise_id VARCHAR(255) NOT NULL, -- (外键) 所属企业ID
    name VARCHAR(100) NOT NULL, -- 部门名称
    parent_department_id VARCHAR(255), -- (外键) 上级部门ID
    head_employee_user_id VARCHAR(255), -- (外键) 负责人用户ID (员工用户)
    description TEXT, -- 部门描述
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建日期
    FOREIGN KEY (saas_enterprise_id) REFERENCES SaasEnterprises(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (parent_department_id) REFERENCES SaasDepartments(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (head_employee_user_id) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 25. `SaasEmployees` (SAAS企业员工表)
CREATE TABLE SaasEmployees (
    id VARCHAR(255) PRIMARY KEY, -- 员工记录ID
    user_id VARCHAR(255) UNIQUE, -- (外键) 关联用户ID
    saas_enterprise_id VARCHAR(255) NOT NULL, -- (外键) 所属企业ID
    saas_department_id VARCHAR(255), -- (外键) 所属部门ID
    employee_number VARCHAR(100), -- 工号
    role_title VARCHAR(100), -- 职位/角色名称
    join_date DATE, -- 入职日期
    employee_status VARCHAR(15) DEFAULT 'active' CHECK (employee_status IN ('active','on_leave','terminated')), -- 员工状态
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (saas_enterprise_id) REFERENCES SaasEnterprises(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (saas_department_id) REFERENCES SaasDepartments(id) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE (saas_enterprise_id, employee_number) -- 工号在企业内唯一
);

-- 26. `SaasSystemRoles` (SAAS平台系统角色表)
CREATE TABLE SaasSystemRoles (
    id VARCHAR(255) PRIMARY KEY, -- 角色ID
    name VARCHAR(100) NOT NULL UNIQUE, -- 角色名称 (如:超管)
    description TEXT, -- 角色描述
    permissions TEXT NOT NULL -- 权限列表JSON (TEXT for JSON)
);

-- 27. `SaasUserSystemRoles` (SAAS平台用户角色关联表)
CREATE TABLE SaasUserSystemRoles (
    saas_user_id VARCHAR(255) NOT NULL, -- (外键) SAAS管理员用户ID
    saas_system_role_id VARCHAR(255) NOT NULL, -- (外键) SAAS系统角色ID
    PRIMARY KEY (saas_user_id, saas_system_role_id),
    FOREIGN KEY (saas_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (saas_system_role_id) REFERENCES SaasSystemRoles(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 29. `SaasOrders` (SAAS订单表)
CREATE TABLE SaasOrders (
    id VARCHAR(255) PRIMARY KEY, -- 订单ID
    saas_enterprise_id VARCHAR(255) NOT NULL, -- (外键) 购买企业ID
    saas_service_package_id VARCHAR(255) NOT NULL, -- (外键) 购买服务包ID
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 订单日期
    payment_status VARCHAR(15) NOT NULL CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'processing')), -- 支付状态
    amount DECIMAL(10,2) NOT NULL, -- 订单金额
    currency VARCHAR(10) DEFAULT 'CNY', -- 货币
    transaction_id VARCHAR(255) UNIQUE, -- 交易ID
    billing_cycle VARCHAR(10) NOT NULL CHECK (billing_cycle IN ('monthly', 'annually', 'one-time')), -- 计费周期
    renewal_date DATE, -- 下次续费日期 (若适用)
    invoice_number VARCHAR(100), -- 发票号
    notes TEXT, -- 订单备注
    FOREIGN KEY (saas_enterprise_id) REFERENCES SaasEnterprises(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (saas_service_package_id) REFERENCES SaasServicePackages(id) ON DELETE RESTRICT ON UPDATE CASCADE -- Prevent deleting package if orders exist
);

-- 30. `SaasCommunityMessageLogs` (SAAS社群消息日志表)
CREATE TABLE SaasCommunityMessageLogs (
    id VARCHAR(255) PRIMARY KEY, -- 日志ID
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('wechat_personal', 'wechat_enterprise')), -- 平台 (个微, 企微)
    group_id_external VARCHAR(255) NOT NULL, -- 外部群ID
    group_name VARCHAR(255), -- 群名称
    sender_external_id VARCHAR(255) NOT NULL, -- 发送者外部ID
    sender_name VARCHAR(255), -- 发送者昵称
    message_external_id VARCHAR(255) NOT NULL UNIQUE, -- 消息外部ID
    message_content_type VARCHAR(50) NOT NULL, -- 消息内容类型
    message_text TEXT, -- 文本消息内容
    message_file_url VARCHAR(255), -- 文件/图片URL
    timestamp TIMESTAMP NOT NULL, -- 消息时间戳
    raw_data_json TEXT, -- 原始消息数据 (JSON) (TEXT for JSON)
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 记录时间
);

-- 31. `SaasSopServices` (SAAS SOP服务配置表)
CREATE TABLE SaasSopServices (
    id VARCHAR(255) PRIMARY KEY, -- 服务ID
    name VARCHAR(255) NOT NULL, -- 服务名称
    type VARCHAR(10) NOT NULL CHECK (type IN ('Coze', 'Dify', 'Other')), -- 服务类型
    api_endpoint VARCHAR(255) NOT NULL, -- API端点URL
    api_key_encrypted VARCHAR(512), -- 加密的API密钥 (加密存储)
    description TEXT, -- 服务描述
    status VARCHAR(10) NOT NULL CHECK (status IN ('active', 'inactive', 'error')), -- 服务状态
    parameters_json TEXT, -- 固定参数JSON (TEXT for JSON)
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建日期
    last_call_timestamp TIMESTAMP, -- 最近调用时间
    total_call_count INTEGER DEFAULT 0, -- 总调用次数
    error_count INTEGER DEFAULT 0 -- 错误次数
);

-- 32. `SaasOutboundCallTasks` (SAAS平台外呼任务表)
CREATE TABLE SaasOutboundCallTasks (
    id VARCHAR(255) PRIMARY KEY, -- 任务ID
    name VARCHAR(255) NOT NULL, -- 任务名称
    target_type VARCHAR(25) NOT NULL CHECK (target_type IN ('customer_segment', 'employee_group', 'custom_list', 'individual_patient')), -- 目标类型
    target_details TEXT NOT NULL, -- 目标详情
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending_schedule', 'scheduled', 'in_progress', 'completed', 'failed', 'cancelled')), -- 任务状态
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建日期
    scheduled_time TIMESTAMP, -- 计划执行时间
    sop_service_id VARCHAR(255), -- (外键) 关联SOP服务ID
    assigned_user_id VARCHAR(255), -- (外键) 分配SAAS用户ID
    call_count_total INTEGER DEFAULT 0, -- 总呼叫数
    call_count_success INTEGER DEFAULT 0, -- 成功呼叫数
    notes TEXT, -- 任务备注
    FOREIGN KEY (sop_service_id) REFERENCES SaasSopServices(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (assigned_user_id) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 33. `SaasApiKeys` (SAAS API密钥表)
CREATE TABLE SaasApiKeys (
    id VARCHAR(255) PRIMARY KEY, -- 密钥ID
    saas_enterprise_id VARCHAR(255), -- (外键) 关联企业ID (可选)
    key_value_hash VARCHAR(255) NOT NULL UNIQUE, -- 哈希后的API密钥值
    key_prefix VARCHAR(10) NOT NULL UNIQUE, -- 密钥前缀 (用于识别)
    description VARCHAR(255), -- 密钥描述
    status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'revoked')), -- 状态
    rate_limit_per_minute INTEGER, -- 每分钟请求限制
    permissions_json TEXT NOT NULL, -- 此密钥拥有的权限列表JSON (TEXT for JSON)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    expires_at TIMESTAMP, -- 过期时间
    FOREIGN KEY (saas_enterprise_id) REFERENCES SaasEnterprises(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 34. `SaasSystemSettings` (SAAS平台系统设置表)
CREATE TABLE SaasSystemSettings (
    setting_key VARCHAR(100) PRIMARY KEY, -- 设置键
    setting_value TEXT NOT NULL, -- 设置值
    description VARCHAR(255), -- 设置描述
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- MySQL: ON UPDATE CURRENT_TIMESTAMP
);

-- 35. `OutboundCallGroups` (SAAS/医生端通用 - 外呼组表)
CREATE TABLE OutboundCallGroups (
    id VARCHAR(255) PRIMARY KEY, -- 组ID
    saas_enterprise_id VARCHAR(255) NOT NULL, -- (外键) 所属企业ID
    name VARCHAR(255) NOT NULL, -- 组名称
    description TEXT, -- 组描述
    created_by_user_id VARCHAR(255) NOT NULL, -- (外键) 创建者用户ID
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建日期
    member_count INTEGER DEFAULT 0, -- 成员数量
    FOREIGN KEY (saas_enterprise_id) REFERENCES SaasEnterprises(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (created_by_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 22. `DoctorPatientMessages` (医患消息推送表 - 医生端发起)
-- (Depends on OutboundCallGroups, defined after it)
CREATE TABLE DoctorPatientMessages (
    id VARCHAR(255) PRIMARY KEY, -- 消息ID
    sender_doctor_id VARCHAR(255) NOT NULL, -- (外键)发送医生ID
    recipient_patient_id VARCHAR(255), -- (外键)接收病人ID
    recipient_group_id VARCHAR(255), -- (外键)接收群组ID
    title VARCHAR(255) NOT NULL, -- 消息标题
    content TEXT NOT NULL, -- 消息内容
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 发送时间
    read_count INTEGER DEFAULT 0, -- 阅读数量 (用于群组)
    delivery_status VARCHAR(50) DEFAULT 'sent', -- 发送状态
    FOREIGN KEY (sender_doctor_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (recipient_patient_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (recipient_group_id) REFERENCES OutboundCallGroups(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 36. `OutboundCallGroupMembers` (SAAS/医生端通用 - 外呼组成员表)
CREATE TABLE OutboundCallGroupMembers (
    group_id VARCHAR(255) NOT NULL, -- (外键) 外呼组ID
    patient_user_id VARCHAR(255) NOT NULL, -- (外键) 病人用户ID
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 添加时间
    PRIMARY KEY (group_id, patient_user_id),
    FOREIGN KEY (group_id) REFERENCES OutboundCallGroups(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (patient_user_id) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- 37. `SaasScheduledTasks` (SAAS平台定时任务表)
CREATE TABLE SaasScheduledTasks (
    id VARCHAR(255) PRIMARY KEY, -- 任务ID
    name VARCHAR(255) NOT NULL UNIQUE, -- 任务名称
    type VARCHAR(25) NOT NULL CHECK (type IN ('data_backup', 'report_generation', 'notification_push', 'system_cleanup', 'external_sync')), -- 任务类型
    cron_expression VARCHAR(100) NOT NULL, -- CRON表达式 (例如: "0 2 * * *")
    status VARCHAR(10) NOT NULL CHECK (status IN ('enabled', 'disabled', 'running', 'error')), -- 状态
    last_run_at TIMESTAMP, -- 上次运行时间
    next_run_at TIMESTAMP, -- 下次计划运行时间
    last_run_status VARCHAR(50), -- 上次运行结果
    description TEXT, -- 任务描述
    job_handler_identifier VARCHAR(255) NOT NULL -- 任务处理器标识符
);

-- 38. `SystemLogs` (系统日志表 - 通用)
CREATE TABLE SystemLogs (
    id BIGSERIAL PRIMARY KEY, -- 日志ID (Using BIGSERIAL for auto-increment PK in PostgreSQL, or BIGINT AUTO_INCREMENT in MySQL)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 时间戳
    level VARCHAR(10) NOT NULL CHECK (level IN ('INFO', 'WARN', 'ERROR', 'DEBUG', 'FATAL')), -- 日志级别
    source VARCHAR(100), -- 日志来源模块 (如: patient_app, doctor_portal, saas_admin)
    user_id VARCHAR(255), -- (外键) 操作用户
    message TEXT NOT NULL, -- 日志消息
    context_json TEXT, -- 额外上下文信息 (TEXT for JSON)
    ip_address VARCHAR(45), -- IP地址
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Comments on potential cross-DB compatibility issues:
-- 1. `ON UPDATE CURRENT_TIMESTAMP` for `updated_at` columns is MySQL-specific.
--    For PostgreSQL and other databases, this typically requires a trigger.
--    Example for PostgreSQL:
--    CREATE OR REPLACE FUNCTION update_updated_at_column()
--    RETURNS TRIGGER AS $$
--    BEGIN
--       NEW.updated_at = now();
--       RETURN NEW;
--    END;
--    $$ language 'plpgsql';
--    -- Then, for each table with an updated_at column:
--    -- CREATE TRIGGER update_users_updated_at
--    -- BEFORE UPDATE ON Users
--    -- FOR EACH ROW
--    -- EXECUTE FUNCTION update_updated_at_column();

-- 2. `JSON` data type is represented as `TEXT`. If your database supports a native JSON/JSONB type,
--    it's recommended to use that for columns like `family_medical_history`, `allergies`,
--    `current_symptoms`, `health_goals`, `permissions_json`, `raw_data_json`, `parameters_json`, `context_json`.

-- 3. `ENUM` types are implemented using `VARCHAR` and `CHECK` constraints for broader compatibility.
--    Native `ENUM` types can be used if supported by your specific database.

-- 4. `BIGSERIAL` for `SystemLogs.id` is PostgreSQL specific for auto-incrementing BIGINT.
--    MySQL would use `BIGINT AUTO_INCREMENT PRIMARY KEY`.
--    SQLite would use `INTEGER PRIMARY KEY AUTOINCREMENT`.

-- Consider adding indexes for frequently queried columns, especially foreign keys and columns used in WHERE clauses.
-- Example: CREATE INDEX idx_users_email ON Users(email);
-- Example: CREATE INDEX idx_healthdatarecords_patient_recorded ON HealthDataRecords(patient_user_id, recorded_at);

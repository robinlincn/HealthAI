# AI 慢病管理系统 - 数据库表结构设计

## 核心用户与档案

### 1. `Users` (用户表 - 通用)
存储所有系统用户的基本信息，通过 `user_type` 区分。

| 字段名                | 数据类型                                                    | 约束/注释                                          | 中文注释             |
| --------------------- | ----------------------------------------------------------- | -------------------------------------------------- | -------------------- |
| `id`                  | VARCHAR(255)                                                | PK (主键)                                          | 用户ID               |
| `user_type`           | ENUM('patient', 'doctor', 'saas_admin')                     | NOT NULL                                           | 用户类型             |
| `email`               | VARCHAR(255)                                                | UNIQUE, NOT NULL                                   | 邮箱 (登录用)        |
| `password_hash`       | VARCHAR(255)                                                | NOT NULL                                           | 哈希密码             |
| `name`                | VARCHAR(100)                                                | NOT NULL                                           | 姓名                 |
| `phone_number`        | VARCHAR(20)                                                 | UNIQUE, NULLABLE                                   | 手机号               |
| `avatar_url`          | VARCHAR(255)                                                | NULLABLE                                           | 头像URL              |
| `status`              | ENUM('active', 'inactive', 'pending_approval', 'suspended') | NOT NULL, DEFAULT 'active'                         | 账户状态             |
| `created_at`          | TIMESTAMP                                                   | DEFAULT CURRENT_TIMESTAMP                          | 创建时间             |
| `updated_at`          | TIMESTAMP                                                   | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间             |
| `last_login_at`       | TIMESTAMP                                                   | NULLABLE                                           | 最后登录时间         |
| `saas_enterprise_id`  | VARCHAR(255)                                                | FK to `SaasEnterprises.id`, NULLABLE               | (外键) 所属SAAS企业ID (医生/企业管理员) |

### 2. `PatientProfiles` (病人档案表)
存储病人的详细个人信息和医疗背景。

| 字段名                    | 数据类型                                                            | 约束/注释                               | 中文注释         |
| ------------------------- | ------------------------------------------------------------------- | --------------------------------------- | ---------------- |
| `user_id`                 | VARCHAR(255)                                                        | PK, FK to `Users.id` (主键, 外键)       | 用户ID           |
| `gender`                  | ENUM('male', 'female', 'other')                                     | NULLABLE                                | 性别             |
| `date_of_birth`           | DATE                                                                | NULLABLE                                | 出生日期         |
| `address`                 | VARCHAR(255)                                                        | NULLABLE                                | 家庭住址         |
| `blood_type`              | ENUM('A', 'B', 'O', 'AB', 'unknown')                                | NULLABLE                                | 血型             |
| `marital_status`          | ENUM('unmarried', 'married', 'divorced', 'widowed', 'other')        | NULLABLE                                | 婚姻状况         |
| `occupation`              | VARCHAR(100)                                                        | NULLABLE                                | 职业             |
| `education_level`         | VARCHAR(100)                                                        | NULLABLE                                | 文化程度         |
| `primary_diagnosis`       | TEXT                                                                | NULLABLE                                | 主要诊断         |
| `past_medical_history`    | TEXT                                                                | NULLABLE                                | 既往病史         |
| `family_medical_history`  | JSON                                                                | NULLABLE (存储结构化家族病史)             | 家族病史         |
| `allergies`               | JSON                                                                | NULLABLE (存储过敏原列表)                 | 过敏史           |
| `current_symptoms`        | JSON                                                                | NULLABLE (存储当前症状列表)               | 当前症状         |
| `other_medical_info`      | TEXT                                                                | NULLABLE                                | 其他医疗信息     |
| `health_goals`            | JSON                                                                | NULLABLE (存储健康目标列表)               | 健康目标         |
| `managing_doctor_id`      | VARCHAR(255)                                                        | FK to `Users.id`, NULLABLE              | (外键)主管医生ID |

### 3. `EmergencyContacts` (紧急联系人表)
存储病人的紧急联系人信息。

| 字段名           | 数据类型     | 约束/注释                         | 中文注释       |
| ---------------- | ------------ | --------------------------------- | -------------- |
| `id`             | VARCHAR(255) | PK (主键)                         | 紧急联系人ID   |
| `patient_user_id`| VARCHAR(255) | FK to `Users.id`, NOT NULL        | (外键) 病人用户ID |
| `name`           | VARCHAR(100) | NOT NULL                          | 联系人姓名     |
| `relationship`   | VARCHAR(50)  | NOT NULL                          | 与病人关系     |
| `phone_number`   | VARCHAR(20)  | NOT NULL                          | 联系人电话     |
| `created_at`     | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP         | 创建时间       |

### 4. `DoctorProfiles` (医生档案表)
存储医生的专业信息。

| 字段名                  | 数据类型     | 约束/注释                         | 中文注释         |
| ----------------------- | ------------ | --------------------------------- | ---------------- |
| `user_id`               | VARCHAR(255) | PK, FK to `Users.id` (主键, 外键) | 用户ID           |
| `specialty`             | VARCHAR(100) | NULLABLE                          | 专业/科室        |
| `hospital_affiliation`  | VARCHAR(255) | NULLABLE (SAAS模式下可能关联企业表) | 所属医院/机构    |
| `department`            | VARCHAR(100) | NULLABLE                          | 院内部门         |
| `years_of_experience`   | INT          | NULLABLE                          | 执业年限         |
| `license_number`        | VARCHAR(100) | NULLABLE                          | 执业医师编号     |
| `bio`                   | TEXT         | NULLABLE                          | 个人简介/擅长    |

## 健康数据与记录

### 5. `HealthDataRecords` (健康数据记录表)
存储各类健康监测数据。

| 字段名            | 数据类型                                                              | 约束/注释                         | 中文注释                   |
| ----------------- | --------------------------------------------------------------------- | --------------------------------- | -------------------------- |
| `id`              | VARCHAR(255)                                                          | PK (主键)                         | 记录ID                     |
| `patient_user_id` | VARCHAR(255)                                                          | FK to `Users.id`, NOT NULL        | (外键) 病人用户ID           |
| `record_type`     | ENUM('blood_sugar', 'blood_pressure', 'weight', 'lipids', 'exercise') | NOT NULL                          | 记录类型                   |
| `recorded_at`     | TIMESTAMP                                                             | NOT NULL                          | 记录时间                   |
| `value1`          | DECIMAL(10,2)                                                         | NULLABLE                          | 数据值1 (血糖, 收缩压等)   |
| `value2`          | DECIMAL(10,2)                                                         | NULLABLE                          | 数据值2 (舒张压等)         |
| `value3`          | DECIMAL(10,2)                                                         | NULLABLE                          | 数据值3 (心率等)           |
| `value4`          | DECIMAL(10,2)                                                         | NULLABLE                          | 数据值4 (LDL等)            |
| `unit1`           | VARCHAR(20)                                                           | NULLABLE                          | 单位1                      |
| `text_value`      | VARCHAR(255)                                                          | NULLABLE                          | 文本值 (如运动类型)        |
| `notes`           | TEXT                                                                  | NULLABLE                          | 备注 (餐前/餐后, 运动详情) |
| `source`          | ENUM('manual', 'device_sync')                                         | DEFAULT 'manual'                  | 数据来源                   |
| `device_id`       | VARCHAR(100)                                                          | NULLABLE                          | 设备ID (若同步)            |
| `created_at`      | TIMESTAMP                                                             | DEFAULT CURRENT_TIMESTAMP         | 创建时间                   |

### 6. `ExaminationReports` (检查报告表)
存储病人上传的检查报告文件信息。

| 字段名              | 数据类型                      | 约束/注释                         | 中文注释           |
| ------------------- | ----------------------------- | --------------------------------- | ------------------ |
| `id`                | VARCHAR(255)                  | PK (主键)                         | 报告ID             |
| `patient_user_id`   | VARCHAR(255)                  | FK to `Users.id`, NOT NULL        | (外键) 病人用户ID   |
| `doctor_user_id`    | VARCHAR(255)                  | FK to `Users.id`, NULLABLE        | (外键) 上传医生ID   |
| `report_name`       | VARCHAR(255)                  | NOT NULL                          | 报告名称           |
| `report_type`       | ENUM('image', 'pdf', 'other') | NOT NULL                          | 文件类型           |
| `file_url`          | VARCHAR(255)                  | NOT NULL                          | 文件存储URL        |
| `upload_date`       | TIMESTAMP                     | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 上传日期           |
| `description`       | TEXT                          | NULLABLE                          | 报告描述           |
| `report_date`       | DATE                          | NULLABLE                          | 报告实际检查日期   |

### 7. `DietRecords` (饮食记录表)
记录病人的膳食信息。

| 字段名             | 数据类型                                    | 约束/注释                         | 中文注释           |
| ------------------ | ------------------------------------------- | --------------------------------- | ------------------ |
| `id`               | VARCHAR(255)                                | PK (主键)                         | 记录ID             |
| `patient_user_id`  | VARCHAR(255)                                | FK to `Users.id`, NOT NULL        | (外键) 病人用户ID   |
| `meal_type`        | ENUM('breakfast', 'lunch', 'dinner', 'snack') | NOT NULL                          | 膳食类型           |
| `recorded_at`      | TIMESTAMP                                   | NOT NULL                          | 记录时间           |
| `notes`            | TEXT                                        | NULLABLE                          | 备注               |
| `total_calories`   | INT                                         | NULLABLE (计算得出)               | 总热量 (千卡)      |
| `total_protein`    | DECIMAL(10,2)                               | NULLABLE (计算得出)               | 总蛋白质 (克)      |
| `total_carbs`      | DECIMAL(10,2)                               | NULLABLE (计算得出)               | 总碳水化合物 (克)  |
| `total_fat`        | DECIMAL(10,2)                               | NULLABLE (计算得出)               | 总脂肪 (克)        |
| `created_at`       | TIMESTAMP                                   | DEFAULT CURRENT_TIMESTAMP         | 创建时间           |

### 8. `DietRecordItems` (饮食记录条目表)
存储每餐饮食的具体食物条目。

| 字段名                 | 数据类型     | 约束/注释                                | 中文注释             |
| ---------------------- | ------------ | ---------------------------------------- | -------------------- |
| `id`                   | VARCHAR(255) | PK (主键)                                | 条目ID               |
| `diet_record_id`       | VARCHAR(255) | FK to `DietRecords.id`, NOT NULL         | (外键) 饮食记录ID     |
| `food_name`            | VARCHAR(255) | NOT NULL                                 | 食物名称             |
| `quantity_description` | VARCHAR(100) | NOT NULL                                 | 份量描述 (例如: 1碗) |
| `calories`             | INT          | NULLABLE                                 | 热量 (千卡)          |
| `protein`              | DECIMAL(10,2)| NULLABLE                                 | 蛋白质 (克)          |
| `carbs`                | DECIMAL(10,2)| NULLABLE                                 | 碳水化合物 (克)      |
| `fat`                  | DECIMAL(10,2)| NULLABLE                                 | 脂肪 (克)            |
| `food_database_id`     | VARCHAR(255) | FK to `FoodDatabase.id`, NULLABLE      | (外键) 食物库条目ID   |

### 9. `FoodDatabase` (食物数据库表)
存储食物的营养信息。

| 字段名              | 数据类型     | 约束/注释                           | 中文注释         |
| ------------------- | ------------ | ----------------------------------- | ---------------- |
| `id`                | VARCHAR(255) | PK (主键)                           | 食物ID           |
| `name`              | VARCHAR(255) | NOT NULL, UNIQUE                    | 食物名称         |
| `calories_per_100g` | INT          | NULLABLE                            | 每100克热量      |
| `protein_per_100g`  | DECIMAL(10,2)| NULLABLE                            | 每100克蛋白质    |
| `carbs_per_100g`    | DECIMAL(10,2)| NULLABLE                            | 每100克碳水      |
| `fat_per_100g`      | DECIMAL(10,2)| NULLABLE                            | 每100克脂肪      |
| `unit_description`  | VARCHAR(50)  | DEFAULT '100g'                      | 单位描述         |
| `created_by_user_id`| VARCHAR(255) | FK to `Users.id`, NULLABLE          | (外键) 创建用户ID |

## 互动与提醒

### 10. `Consultations` (医患咨询表)
记录医患之间的咨询会话。

| 字段名              | 数据类型                                                                   | 约束/注释                                          | 中文注释         |
| ------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- | ---------------- |
| `id`                | VARCHAR(255)                                                               | PK (主键)                                          | 咨询ID           |
| `patient_user_id`   | VARCHAR(255)                                                               | FK to `Users.id`, NOT NULL                         | (外键) 病人用户ID |
| `doctor_user_id`    | VARCHAR(255)                                                               | FK to `Users.id`, NULLABLE (可系统分配)              | (外键) 医生用户ID |
| `question`          | TEXT                                                                       | NOT NULL                                           | 病人问题         |
| `status`            | ENUM('pending_reply', 'replied', 'closed', 'scheduled', 'pending_confirmation') | NOT NULL                                           | 状态             |
| `created_at`        | TIMESTAMP                                                                  | DEFAULT CURRENT_TIMESTAMP                          | 病人发起时间     |
| `updated_at`        | TIMESTAMP                                                                  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 最后更新时间     |

### 11. `ConsultationMessages` (咨询消息表)
存储咨询会话中的具体消息。

| 字段名                | 数据类型                                  | 约束/注释                         | 中文注释           |
| --------------------- | ----------------------------------------- | --------------------------------- | ------------------ |
| `id`                  | VARCHAR(255)                              | PK (主键)                         | 消息ID             |
| `consultation_id`     | VARCHAR(255)                              | FK to `Consultations.id`, NOT NULL  | (外键) 咨询ID       |
| `sender_user_id`      | VARCHAR(255)                              | FK to `Users.id`, NOT NULL        | (外键) 发送者ID     |
| `message_content`     | TEXT                                      | NOT NULL                          | 消息内容           |
| `message_type`        | ENUM('text', 'image', 'video', 'file')    | DEFAULT 'text'                    | 消息类型           |
| `file_url`            | VARCHAR(255)                              | NULLABLE (非文本消息)             | 文件URL            |
| `sent_at`             | TIMESTAMP                                 | DEFAULT CURRENT_TIMESTAMP         | 发送时间           |

### 12. `Reminders` (提醒表 - 通用)
存储各类健康提醒。

| 字段名                | 数据类型                                                | 约束/注释                         | 中文注释         |
| --------------------- | ------------------------------------------------------- | --------------------------------- | ---------------- |
| `id`                  | VARCHAR(255)                                            | PK (主键)                         | 提醒ID           |
| `patient_user_id`     | VARCHAR(255)                                            | FK to `Users.id`, NOT NULL        | (外键) 病人用户ID |
| `reminder_type`       | ENUM('medication', 'checkup', 'appointment', 'custom')  | NOT NULL                          | 提醒类型         |
| `title`               | VARCHAR(255)                                            | NOT NULL                          | 提醒标题         |
| `description`         | TEXT                                                    | NULLABLE                          | 提醒描述         |
| `due_datetime`        | TIMESTAMP                                               | NOT NULL                          | 到期/提醒时间    |
| `frequency`           | VARCHAR(100)                                            | NULLABLE (如: daily, 0 8 * * 1) | 重复频率         |
| `is_enabled`          | BOOLEAN                                                 | DEFAULT TRUE                      | 是否启用         |
| `last_triggered_at`   | TIMESTAMP                                               | NULLABLE                          | 上次触发时间     |
| `created_at`          | TIMESTAMP                                               | DEFAULT CURRENT_TIMESTAMP         | 创建时间         |

### 13. `ReminderLogs` (提醒执行记录表)
记录提醒的执行情况。

| 字段名         | 数据类型                                      | 约束/注释                         | 中文注释       |
| -------------- | --------------------------------------------- | --------------------------------- | -------------- |
| `id`           | VARCHAR(255)                                  | PK (主键)                         | 记录ID         |
| `reminder_id`  | VARCHAR(255)                                  | FK to `Reminders.id`, NOT NULL    | (外键) 提醒ID   |
| `action_taken` | ENUM('taken', 'skipped', 'done', 'missed')    | NOT NULL                          | 执行动作       |
| `action_time`  | TIMESTAMP                                     | DEFAULT CURRENT_TIMESTAMP         | 执行时间       |
| `notes`        | TEXT                                          | NULLABLE                          | 备注           |

## 扩展功能

### 14. `HealthCourses` (健康课程表)
存储健康教育课程信息。

| 字段名            | 数据类型     | 约束/注释                         | 中文注释       |
| ----------------- | ------------ | --------------------------------- | -------------- |
| `id`              | VARCHAR(255) | PK (主键)                         | 课程ID         |
| `title`           | VARCHAR(255) | NOT NULL                          | 课程标题       |
| `description`     | TEXT         | NULLABLE                          | 课程描述       |
| `category`        | VARCHAR(100) | NULLABLE                          | 课程分类       |
| `duration_text`   | VARCHAR(100) | NULLABLE                          | 课程时长文本   |
| `image_url`       | VARCHAR(255) | NULLABLE                          | 课程封面图URL  |
| `content_url`     | VARCHAR(255) | NULLABLE (或关联内容表)           | 课程内容URL    |
| `created_at`      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP         | 创建时间       |

### 15. `PatientCourseEnrollments` (病人课程报名表)
记录病人参与课程的情况。

| 字段名                 | 数据类型                                  | 约束/注释                         | 中文注释     |
| ---------------------- | ----------------------------------------- | --------------------------------- | ------------ |
| `id`                   | VARCHAR(255)                              | PK (主键)                         | 报名ID       |
| `patient_user_id`      | VARCHAR(255)                              | FK to `Users.id`, NOT NULL        | (外键) 病人ID |
| `course_id`            | VARCHAR(255)                              | FK to `HealthCourses.id`, NOT NULL| (外键) 课程ID |
| `enrollment_date`      | TIMESTAMP                                 | DEFAULT CURRENT_TIMESTAMP         | 报名时间     |
| `progress_percentage`  | INT                                       | DEFAULT 0                         | 学习进度 (%) |
| `status`               | ENUM('enrolled', 'in_progress', 'completed') | DEFAULT 'enrolled'                | 学习状态     |

### 16. `CommunityPosts` (社区帖子表)
存储社区中的帖子。

| 字段名          | 数据类型     | 约束/注释                                          | 中文注释   |
| --------------- | ------------ | -------------------------------------------------- | ---------- |
| `id`            | VARCHAR(255) | PK (主键)                                          | 帖子ID     |
| `author_user_id`| VARCHAR(255) | FK to `Users.id`, NOT NULL                         | (外键) 作者ID |
| `content`       | TEXT         | NOT NULL                                           | 帖子内容   |
| `created_at`    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                          | 发布时间   |
| `updated_at`    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间   |
| `likes_count`   | INT          | DEFAULT 0                                          | 点赞数     |

### 17. `CommunityComments` (社区评论表)
存储对社区帖子的评论。

| 字段名              | 数据类型     | 约束/注释                                 | 中文注释         |
| ------------------- | ------------ | ----------------------------------------- | ---------------- |
| `id`                | VARCHAR(255) | PK (主键)                                 | 评论ID           |
| `post_id`           | VARCHAR(255) | FK to `CommunityPosts.id`, NOT NULL       | (外键) 帖子ID     |
| `author_user_id`    | VARCHAR(255) | FK to `Users.id`, NOT NULL                | (外键) 评论者ID   |
| `parent_comment_id` | VARCHAR(255) | FK to `CommunityComments.id`, NULLABLE  | (外键) 父评论ID   |
| `content`           | TEXT         | NOT NULL                                  | 评论内容         |
| `created_at`        | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                 | 发布时间         |

## 医生端特定功能

### 18. `Appointments` (预约表)
管理医生和病人之间的预约。

| 字段名                  | 数据类型                                                                              | 约束/注释                                          | 中文注释     |
| ----------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------ |
| `id`                    | VARCHAR(255)                                                                          | PK (主键)                                          | 预约ID       |
| `patient_user_id`       | VARCHAR(255)                                                                          | FK to `Users.id`, NOT NULL                         | (外键) 病人ID |
| `doctor_user_id`        | VARCHAR(255)                                                                          | FK to `Users.id`, NOT NULL                         | (外键) 医生ID |
| `appointment_datetime`  | TIMESTAMP                                                                             | NOT NULL                                           | 预约日期时间 |
| `duration_minutes`      | INT                                                                                   | DEFAULT 30                                         | 预约时长(分钟) |
| `reason`                | TEXT                                                                                  | NULLABLE                                           | 预约事由     |
| `status`                | ENUM('scheduled', 'completed', 'cancelled_by_patient', 'cancelled_by_doctor', 'pending_confirmation') | NOT NULL                                           | 预约状态     |
| `notes_patient`         | TEXT                                                                                  | NULLABLE                                           | 病人备注     |
| `notes_doctor`          | TEXT                                                                                  | NULLABLE                                           | 医生备注     |
| `created_at`            | TIMESTAMP                                                                             | DEFAULT CURRENT_TIMESTAMP                          | 创建时间     |
| `updated_at`            | TIMESTAMP                                                                             | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间     |

### 19. `TreatmentPlans` (治疗方案表)
存储医生为病人制定的治疗方案。

| 字段名                   | 数据类型     | 约束/注释                                          | 中文注释         |
| ------------------------ | ------------ | -------------------------------------------------- | ---------------- |
| `id`                     | VARCHAR(255) | PK (主键)                                          | 方案ID           |
| `patient_user_id`        | VARCHAR(255) | FK to `Users.id`, NOT NULL                         | (外键) 病人ID     |
| `doctor_user_id`         | VARCHAR(255) | FK to `Users.id`, NOT NULL                         | (外键) 制定医生ID |
| `plan_name`              | VARCHAR(255) | DEFAULT '默认治疗方案'                             | 方案名称         |
| `start_date`             | DATE         | NOT NULL                                           | 开始日期         |
| `end_date`               | DATE         | NULLABLE                                           | 结束日期 (可选)  |
| `short_term_goals`       | TEXT         | NULLABLE                                           | 短期目标         |
| `long_term_goals`        | TEXT         | NULLABLE                                           | 长期目标         |
| `lifestyle_adjustments`  | TEXT         | NULLABLE                                           | 生活方式调整建议 |
| `is_active`              | BOOLEAN      | DEFAULT TRUE                                       | 是否当前激活方案 |
| `created_at`             | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                          | 创建时间         |
| `updated_at`             | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间         |

### 20. `TreatmentPlanMedications` (治疗方案药物表)
存储治疗方案中包含的药物信息。

| 字段名              | 数据类型     | 约束/注释                               | 中文注释           |
| ------------------- | ------------ | --------------------------------------- | ------------------ |
| `id`                | VARCHAR(255) | PK (主键)                               | ID                 |
| `treatment_plan_id` | VARCHAR(255) | FK to `TreatmentPlans.id`, NOT NULL     | (外键) 治疗方案ID   |
| `drug_name`         | VARCHAR(255) | NOT NULL                                | 药物名称           |
| `dosage`            | VARCHAR(100) | NOT NULL                                | 剂量               |
| `frequency`         | VARCHAR(100) | NOT NULL                                | 服用频率           |
| `notes`             | TEXT         | NULLABLE                                | 服用备注           |
| `start_date`        | DATE         | NOT NULL                                | 开始服用日期       |
| `end_date`          | DATE         | NULLABLE                                | 结束服用日期 (可选) |

### 21. `TreatmentAdvices` (治疗建议记录表)
记录医生给出的具体治疗建议及病人反馈。

| 字段名                   | 数据类型                                                               | 约束/注释                                 | 中文注释           |
| ------------------------ | ---------------------------------------------------------------------- | ----------------------------------------- | ------------------ |
| `id`                     | VARCHAR(255)                                                           | PK (主键)                                 | 建议ID             |
| `patient_user_id`        | VARCHAR(255)                                                           | FK to `Users.id`, NOT NULL                | (外键) 病人ID       |
| `doctor_user_id`         | VARCHAR(255)                                                           | FK to `Users.id`, NOT NULL                | (外键) 建议医生ID   |
| `treatment_plan_id`      | VARCHAR(255)                                                           | FK to `TreatmentPlans.id`, NULLABLE       | (外键) 关联治疗方案ID |
| `advice_content`         | TEXT                                                                   | NOT NULL                                  | 建议内容           |
| `advice_date`            | TIMESTAMP                                                              | DEFAULT CURRENT_TIMESTAMP                 | 建议发出时间       |
| `patient_feedback_status`| ENUM('pending', 'acknowledged', 'implemented', 'rejected')               | DEFAULT 'pending'                         | 病人执行状态/反馈    |
| `patient_feedback_notes` | TEXT                                                                   | NULLABLE                                  | 病人反馈备注       |

### 22. `DoctorPatientMessages` (医患消息推送表 - 医生端发起)
存储医生向病人或群组推送的消息。

| 字段名                 | 数据类型     | 约束/注释                                     | 中文注释             |
| ---------------------- | ------------ | --------------------------------------------- | -------------------- |
| `id`                   | VARCHAR(255) | PK (主键)                                     | 消息ID               |
| `sender_doctor_id`     | VARCHAR(255) | FK to `Users.id`, NOT NULL                    | (外键)发送医生ID     |
| `recipient_patient_id` | VARCHAR(255) | FK to `Users.id`, NULLABLE                    | (外键)接收病人ID     |
| `recipient_group_id`   | VARCHAR(255) | FK to `OutboundCallGroups.id`, NULLABLE       | (外键)接收群组ID     |
| `title`                | VARCHAR(255) | NOT NULL                                      | 消息标题             |
| `content`              | TEXT         | NOT NULL                                      | 消息内容             |
| `sent_at`              | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                     | 发送时间             |
| `read_count`           | INT          | DEFAULT 0                                     | 阅读数量 (用于群组)  |
| `delivery_status`      | VARCHAR(50)  | DEFAULT 'sent'                                | 发送状态             |

### `OutboundCallGroups` (外呼组表) - 用于医生端外呼计划
(定义见 SAAS 部分第 35 项，医生端可读取/创建属于其企业的组)

### `OutboundCallTasks` (外呼任务表) - 用于医生端外呼计划
(定义见 SAAS 部分第 31/36 项，医生端可创建针对其病人/组的任务，可能与 `SaasOutboundCallTasks` 有重叠或继承关系，具体看实现)


## SAAS 管理后台表结构

### 23. `SaasEnterprises` (SAAS企业/医院表)
管理SAAS平台上的企业/医院账户。

| 字段名                   | 数据类型                                                    | 约束/注释                                | 中文注释               |
| ------------------------ | ----------------------------------------------------------- | ---------------------------------------- | ---------------------- |
| `id`                     | VARCHAR(255)                                                | PK (主键)                                | 企业ID                 |
| `name`                   | VARCHAR(255)                                                | NOT NULL, UNIQUE                         | 企业名称               |
| `contact_person`         | VARCHAR(100)                                                | NOT NULL                                 | 联系人                 |
| `contact_email`          | VARCHAR(255)                                                | NOT NULL, UNIQUE                         | 联系邮箱               |
| `contact_phone`          | VARCHAR(20)                                                 | NOT NULL                                 | 联系电话               |
| `address`                | VARCHAR(255)                                                | NULLABLE                                 | 地址                   |
| `status`                 | ENUM('active', 'inactive', 'pending_approval', 'suspended') | NOT NULL, DEFAULT 'pending_approval'     | 账户状态               |
| `creation_date`          | TIMESTAMP                                                   | DEFAULT CURRENT_TIMESTAMP                | 创建日期               |
| `max_users`              | INT                                                         | NOT NULL                                 | 分配最大用户数         |
| `max_storage_gb`         | INT                                                         | NOT NULL                                 | 分配最大存储空间 (GB)  |
| `max_patients`           | INT                                                         | NOT NULL                                 | 分配最大病人额度       |
| `current_users_count`    | INT                                                         | DEFAULT 0                                | 当前用户数 (员工)      |
| `current_patients_count` | INT                                                         | DEFAULT 0                                | 当前病人数量           |
| `notes`                  | TEXT                                                        | NULLABLE                                 | 备注                   |
| `service_package_id`     | VARCHAR(255)                                                | FK to `SaasServicePackages.id`, NULLABLE | (外键) 订阅的服务包ID   |

### 24. `SaasDepartments` (SAAS企业部门表)
管理企业内部的部门/科室结构。

| 字段名                    | 数据类型     | 约束/注释                                | 中文注释           |
| ------------------------- | ------------ | ---------------------------------------- | ------------------ |
| `id`                      | VARCHAR(255) | PK (主键)                                | 部门ID             |
| `saas_enterprise_id`      | VARCHAR(255) | FK to `SaasEnterprises.id`, NOT NULL     | (外键) 所属企业ID   |
| `name`                    | VARCHAR(100) | NOT NULL                                 | 部门名称           |
| `parent_department_id`    | VARCHAR(255) | FK to `SaasDepartments.id`, NULLABLE     | (外键) 上级部门ID   |
| `head_employee_user_id`   | VARCHAR(255) | FK to `Users.id` (员工用户), NULLABLE  | (外键) 负责人用户ID |
| `description`             | TEXT         | NULLABLE                                 | 部门描述           |
| `creation_date`           | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                | 创建日期           |

### 25. `SaasEmployees` (SAAS企业员工表)
存储企业/医院的员工信息，关联到 `Users` 表。
(注意: 实际可能复用 `Users` 表，通过 `saas_enterprise_id` 和 `user_type='doctor'` 或新 `user_type='enterprise_employee'` 区分。)
如果单独建表，则：
| 字段名             | 数据类型                       | 约束/注释                         | 中文注释         |
| ------------------ | ------------------------------ | --------------------------------- | ---------------- |
| `id`               | VARCHAR(255)                   | PK (主键)                         | 员工记录ID       |
| `user_id`          | VARCHAR(255)                   | FK to `Users.id`, UNIQUE          | (外键) 关联用户ID |
| `saas_enterprise_id`| VARCHAR(255)                  | FK to `SaasEnterprises.id`, NOT NULL| (外键) 所属企业ID |
| `saas_department_id`| VARCHAR(255)                  | FK to `SaasDepartments.id`, NULLABLE| (外键) 所属部门ID |
| `employee_number`  | VARCHAR(100)                   | NULLABLE, UNIQUE within enterprise| 工号             |
| `role_title`       | VARCHAR(100)                   | NULLABLE                          | 职位/角色名称    |
| `join_date`        | DATE                           | NULLABLE                          | 入职日期         |
| `employee_status`  | ENUM('active','on_leave','terminated') | DEFAULT 'active'                  | 员工状态         |

### 26. `SaasSystemRoles` (SAAS平台系统角色表)
定义SAAS平台管理员的角色。

| 字段名        | 数据类型     | 约束/注释              | 中文注释             |
| ------------- | ------------ | ---------------------- | -------------------- |
| `id`          | VARCHAR(255) | PK (主键)              | 角色ID               |
| `name`        | VARCHAR(100) | NOT NULL, UNIQUE       | 角色名称 (如:超管) |
| `description` | TEXT         | NULLABLE               | 角色描述             |
| `permissions` | JSON         | NOT NULL (权限列表JSON) | 权限列表             |

### 27. `SaasUserSystemRoles` (SAAS平台用户角色关联表)
SAAS管理员用户 (user_type='saas_admin') 与其角色的多对多关联。

| 字段名                 | 数据类型     | 约束/注释                               | 中文注释               |
| ---------------------- | ------------ | --------------------------------------- | ---------------------- |
| `saas_user_id`         | VARCHAR(255) | PK, FK to `Users.id`                    | (外键) SAAS管理员用户ID |
| `saas_system_role_id`  | VARCHAR(255) | PK, FK to `SaasSystemRoles.id`          | (外键) SAAS系统角色ID   |


### 28. `SaasServicePackages` (SAAS服务包表)
定义平台提供的服务包。

| 字段名                 | 数据类型                                  | 约束/注释                         | 中文注释             |
| ---------------------- | ----------------------------------------- | --------------------------------- | -------------------- |
| `id`                   | VARCHAR(255)                              | PK (主键)                         | 服务包ID             |
| `name`                 | VARCHAR(255)                              | NOT NULL, UNIQUE                  | 服务包名称           |
| `type`                 | ENUM('basic', 'standard', 'premium', 'custom') | NOT NULL                          | 类型                 |
| `price_monthly`        | DECIMAL(10,2)                             | NOT NULL                          | 月度价格 (元)        |
| `price_annually`       | DECIMAL(10,2)                             | NULLABLE                          | 年度价格 (元)        |
| `features_json`        | JSON                                      | NOT NULL (功能特性列表JSON)       | 功能特性             |
| `highlights`           | TEXT                                      | NULLABLE                          | 亮点说明             |
| `max_users_limit`      | INT                                       | NOT NULL                          | 此包最大用户数       |
| `max_storage_gb_limit` | INT                                       | NOT NULL                          | 此包最大存储 (GB)    |
| `max_patients_limit`   | INT                                       | NOT NULL                          | 此包最大病人额度     |
| `is_enabled`           | BOOLEAN                                   | DEFAULT TRUE                      | 是否启用销售         |
| `created_at`           | TIMESTAMP                                 | DEFAULT CURRENT_TIMESTAMP         | 创建时间             |

### 29. `SaasOrders` (SAAS订单表)
记录企业购买服务包的订单。

| 字段名                    | 数据类型                                                         | 约束/注释                             | 中文注释             |
| ------------------------- | ---------------------------------------------------------------- | ------------------------------------- | -------------------- |
| `id`                      | VARCHAR(255)                                                     | PK (主键)                             | 订单ID               |
| `saas_enterprise_id`      | VARCHAR(255)                                                     | FK to `SaasEnterprises.id`, NOT NULL  | (外键) 购买企业ID     |
| `saas_service_package_id` | VARCHAR(255)                                                     | FK to `SaasServicePackages.id`, NOT NULL| (外键) 购买服务包ID   |
| `order_date`              | TIMESTAMP                                                        | DEFAULT CURRENT_TIMESTAMP             | 订单日期             |
| `payment_status`          | ENUM('pending', 'paid', 'failed', 'refunded', 'processing')      | NOT NULL                              | 支付状态             |
| `amount`                  | DECIMAL(10,2)                                                  | NOT NULL                              | 订单金额             |
| `currency`                | VARCHAR(10)                                                      | DEFAULT 'CNY'                         | 货币                 |
| `transaction_id`          | VARCHAR(255)                                                     | NULLABLE, UNIQUE                      | 交易ID               |
| `billing_cycle`           | ENUM('monthly', 'annually', 'one-time')                          | NOT NULL                              | 计费周期             |
| `renewal_date`            | DATE                                                             | NULLABLE                              | 下次续费日期 (若适用) |
| `invoice_number`          | VARCHAR(100)                                                     | NULLABLE                              | 发票号               |
| `notes`                   | TEXT                                                             | NULLABLE                              | 订单备注             |

### 30. `SaasCommunityMessageLogs` (SAAS社群消息日志表)
记录微信等社群的聊天记录。

| 字段名                 | 数据类型                                  | 约束/注释                         | 中文注释             |
| ---------------------- | ----------------------------------------- | --------------------------------- | -------------------- |
| `id`                   | VARCHAR(255)                              | PK (主键)                         | 日志ID               |
| `platform`             | ENUM('wechat_personal', 'wechat_enterprise') | NOT NULL                          | 平台 (个微, 企微)   |
| `group_id_external`    | VARCHAR(255)                              | NOT NULL                          | 外部群ID             |
| `group_name`           | VARCHAR(255)                              | NULLABLE                          | 群名称               |
| `sender_external_id`   | VARCHAR(255)                              | NOT NULL                          | 发送者外部ID         |
| `sender_name`          | VARCHAR(255)                              | NULLABLE                          | 发送者昵称           |
| `message_external_id`  | VARCHAR(255)                              | NOT NULL, UNIQUE                  | 消息外部ID           |
| `message_content_type` | VARCHAR(50)                               | NOT NULL                          | 消息内容类型         |
| `message_text`         | TEXT                                      | NULLABLE                          | 文本消息内容         |
| `message_file_url`     | VARCHAR(255)                              | NULLABLE                          | 文件/图片URL         |
| `timestamp`            | TIMESTAMP                                 | NOT NULL                          | 消息时间戳           |
| `raw_data_json`        | JSON                                      | NULLABLE                          | 原始消息数据 (JSON) |
| `logged_at`            | TIMESTAMP                                 | DEFAULT CURRENT_TIMESTAMP         | 记录时间             |

### 31. `SaasSopServices` (SAAS SOP服务配置表)
管理 Coze, Dify 等工作流API的配置。

| 字段名                | 数据类型                             | 约束/注释                         | 中文注释           |
| --------------------- | ------------------------------------ | --------------------------------- | ------------------ |
| `id`                  | VARCHAR(255)                         | PK (主键)                         | 服务ID             |
| `name`                | VARCHAR(255)                         | NOT NULL                          | 服务名称           |
| `type`                | ENUM('Coze', 'Dify', 'Other')        | NOT NULL                          | 服务类型           |
| `api_endpoint`        | VARCHAR(255)                         | NOT NULL                          | API端点URL         |
| `api_key_encrypted`   | VARCHAR(512)                         | NULLABLE (加密存储)               | 加密的API密钥      |
| `description`         | TEXT                                 | NULLABLE                          | 服务描述           |
| `status`              | ENUM('active', 'inactive', 'error')  | NOT NULL                          | 服务状态           |
| `parameters_json`     | JSON                                 | NULLABLE (固定参数JSON)           | 固定参数           |
| `creation_date`       | TIMESTAMP                            | DEFAULT CURRENT_TIMESTAMP         | 创建日期           |
| `last_call_timestamp` | TIMESTAMP                            | NULLABLE                          | 最近调用时间       |
| `total_call_count`    | INT                                  | DEFAULT 0                         | 总调用次数         |
| `error_count`         | INT                                  | DEFAULT 0                         | 错误次数           |

### 32. `SaasOutboundCallTasks` (SAAS平台外呼任务表)
管理平台级的外呼任务。

| 字段名                 | 数据类型                                                                              | 约束/注释                                     | 中文注释             |
| ---------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------- | -------------------- |
| `id`                   | VARCHAR(255)                                                                          | PK (主键)                                     | 任务ID               |
| `name`                 | VARCHAR(255)                                                                          | NOT NULL                                      | 任务名称             |
| `target_type`          | ENUM('customer_segment', 'employee_group', 'custom_list', 'individual_patient')       | NOT NULL                                      | 目标类型             |
| `target_details`       | TEXT                                                                                  | NOT NULL                                      | 目标详情             |
| `status`               | ENUM('pending_schedule', 'scheduled', 'in_progress', 'completed', 'failed', 'cancelled') | NOT NULL                                      | 任务状态             |
| `creation_date`        | TIMESTAMP                                                                             | DEFAULT CURRENT_TIMESTAMP                     | 创建日期             |
| `scheduled_time`       | TIMESTAMP                                                                             | NULLABLE                                      | 计划执行时间         |
| `sop_service_id`       | VARCHAR(255)                                                                          | FK to `SaasSopServices.id`, NULLABLE          | (外键) 关联SOP服务ID |
| `assigned_user_id`     | VARCHAR(255)                                                                          | FK to `Users.id` (SAAS用户), NULLABLE         | (外键) 分配SAAS用户ID|
| `call_count_total`     | INT                                                                                   | DEFAULT 0                                     | 总呼叫数             |
| `call_count_success`   | INT                                                                                   | DEFAULT 0                                     | 成功呼叫数           |
| `notes`                | TEXT                                                                                  | NULLABLE                                      | 任务备注             |

### 33. `SaasApiKeys` (SAAS API密钥表)
管理平台对外提供的API密钥。

| 字段名                  | 数据类型     | 约束/注释                                  | 中文注释               |
| ----------------------- | ------------ | ------------------------------------------ | ---------------------- |
| `id`                    | VARCHAR(255) | PK (主键)                                  | 密钥ID                 |
| `saas_enterprise_id`    | VARCHAR(255) | FK to `SaasEnterprises.id`, NULLABLE       | (外键) 关联企业ID (可选) |
| `key_value_hash`        | VARCHAR(255) | NOT NULL, UNIQUE (哈希存储)                | 哈希后的API密钥值      |
| `key_prefix`            | VARCHAR(10)  | NOT NULL, UNIQUE                           | 密钥前缀 (用于识别)    |
| `description`           | VARCHAR(255) | NULLABLE                                   | 密钥描述               |
| `status`                | ENUM('active', 'revoked')                   | DEFAULT 'active'                         | 状态                   |
| `rate_limit_per_minute` | INT          | NULLABLE                                   | 每分钟请求限制         |
| `permissions_json`      | JSON         | NOT NULL (此密钥拥有的权限列表JSON)         | 权限列表               |
| `created_at`            | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                  | 创建时间               |
| `expires_at`            | TIMESTAMP    | NULLABLE                                   | 过期时间               |

### 34. `SaasSystemSettings` (SAAS平台系统设置表)
键值对形式存储平台全局设置。

| 字段名            | 数据类型     | 约束/注释                                          | 中文注释     |
| ----------------- | ------------ | -------------------------------------------------- | ------------ |
| `setting_key`     | VARCHAR(100) | PK (主键)                                          | 设置键       |
| `setting_value`   | TEXT         | NOT NULL                                           | 设置值       |
| `description`     | VARCHAR(255) | NULLABLE                                           | 设置描述     |
| `last_updated_at` | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 最后更新时间 |

### 35. `OutboundCallGroups` (SAAS/医生端通用 - 外呼组表)
用于SAAS平台或医生端管理外呼的病人组。

| 字段名                 | 数据类型     | 约束/注释                                     | 中文注释           |
| ---------------------- | ------------ | --------------------------------------------- | ------------------ |
| `id`                   | VARCHAR(255) | PK (主键)                                     | 组ID               |
| `saas_enterprise_id`   | VARCHAR(255) | FK to `SaasEnterprises.id`, NOT NULL (若医生端用，则为医生所属企业) | (外键) 所属企业ID   |
| `name`                 | VARCHAR(255) | NOT NULL                                      | 组名称             |
| `description`          | TEXT         | NULLABLE                                      | 组描述             |
| `created_by_user_id`   | VARCHAR(255) | FK to `Users.id`, NOT NULL                  | (外键) 创建者用户ID |
| `creation_date`        | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                     | 创建日期           |
| `member_count`         | INT          | DEFAULT 0                                     | 成员数量           |

### 36. `OutboundCallGroupMembers` (SAAS/医生端通用 - 外呼组成员表)
外呼组与病人的多对多关联。

| 字段名                 | 数据类型     | 约束/注释                                 | 中文注释         |
| ---------------------- | ------------ | ----------------------------------------- | ---------------- |
| `group_id`             | VARCHAR(255) | PK, FK to `OutboundCallGroups.id`         | (外键) 外呼组ID   |
| `patient_user_id`      | VARCHAR(255) | PK, FK to `Users.id`                      | (外键) 病人用户ID |
| `added_at`             | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                 | 添加时间         |

### 37. `SaasScheduledTasks` (SAAS平台定时任务表)
管理平台后台运行的定时任务。

| 字段名                   | 数据类型                                                                                       | 约束/注释                         | 中文注释           |
| ------------------------ | ---------------------------------------------------------------------------------------------- | --------------------------------- | ------------------ |
| `id`                     | VARCHAR(255)                                                                                   | PK (主键)                         | 任务ID             |
| `name`                   | VARCHAR(255)                                                                                   | NOT NULL, UNIQUE                  | 任务名称           |
| `type`                   | ENUM('data_backup', 'report_generation', 'notification_push', 'system_cleanup', 'external_sync') | NOT NULL                          | 任务类型           |
| `cron_expression`        | VARCHAR(100)                                                                                   | NOT NULL (例如: "0 2 * * *")    | CRON表达式         |
| `status`                 | ENUM('enabled', 'disabled', 'running', 'error')                                                | NOT NULL                          | 状态               |
| `last_run_at`            | TIMESTAMP                                                                                      | NULLABLE                          | 上次运行时间       |
| `next_run_at`            | TIMESTAMP                                                                                      | NULLABLE                          | 下次计划运行时间   |
| `last_run_status`        | VARCHAR(50)                                                                                    | NULLABLE                          | 上次运行结果       |
| `description`            | TEXT                                                                                           | NULLABLE                          | 任务描述           |
| `job_handler_identifier` | VARCHAR(255)                                                                                   | NOT NULL                          | 任务处理器标识符   |

### 38. `SystemLogs` (系统日志表 - 通用)
记录系统操作、错误等日志信息。

| 字段名        | 数据类型                                         | 约束/注释                         | 中文注释     |
| ------------- | ------------------------------------------------ | --------------------------------- | ------------ |
| `id`          | BIGINT AUTO_INCREMENT                            | PK (主键)                         | 日志ID       |
| `timestamp`   | TIMESTAMP                                        | DEFAULT CURRENT_TIMESTAMP         | 时间戳       |
| `level`       | ENUM('INFO', 'WARN', 'ERROR', 'DEBUG', 'FATAL')  | NOT NULL                          | 日志级别     |
| `source`      | VARCHAR(100)                                     | NULLABLE (如: patient_app, doctor_portal, saas_admin) | 日志来源模块 |
| `user_id`     | VARCHAR(255)                                     | FK to `Users.id`, NULLABLE        | (外键) 操作用户 |
| `message`     | TEXT                                             | NOT NULL                          | 日志消息     |
| `context_json`| JSON                                             | NULLABLE (额外上下文信息)         | 上下文信息   |
| `ip_address`  | VARCHAR(45)                                      | NULLABLE                          | IP地址       |



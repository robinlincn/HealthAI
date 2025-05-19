
# AI 慢病管理系统 - 数据库表结构设计 (关系型数据库版)

本文档描述了AI慢病管理系统在关系型数据库（如PostgreSQL, MySQL）中的表结构设计。

## 核心用户与档案

### 1. `Users` (用户表 - 通用)
存储所有系统用户的基本认证信息和通用属性。

| 字段名                | 数据类型                                                    | 约束/注释                                          | 中文注释             |
| --------------------- | ----------------------------------------------------------- | -------------------------------------------------- | -------------------- |
| `id`                  | VARCHAR(255)                                                | PK (主键)                                          | 用户ID (UUID或自定义字符串) |
| `user_type`           | VARCHAR(50)                                                 | NOT NULL, CHECK (`user_type` IN ('patient', 'doctor', 'saas_admin', 'enterprise_admin')) | 用户类型             |
| `email`               | VARCHAR(255)                                                | UNIQUE, NOT NULL                                   | 邮箱 (登录用)        |
| `password_hash`       | VARCHAR(255)                                                | NOT NULL                                           | 哈希密码             |
| `name`                | VARCHAR(100)                                                | NOT NULL                                           | 姓名/昵称           |
| `phone_number`        | VARCHAR(20)                                                 | UNIQUE, NULLABLE                                   | 手机号               |
| `avatar_url`          | VARCHAR(255)                                                | NULLABLE                                           | 头像URL              |
| `status`              | VARCHAR(50)                                                 | NOT NULL, DEFAULT 'active', CHECK (`status` IN ('active', 'inactive', 'pending_approval', 'suspended', 'invited', 'disabled')) | 账户状态             |
| `created_at`          | TIMESTAMP WITH TIME ZONE                                    | NOT NULL, DEFAULT CURRENT_TIMESTAMP                | 创建时间             |
| `updated_at`          | TIMESTAMP WITH TIME ZONE                                    | NOT NULL, DEFAULT CURRENT_TIMESTAMP                | 更新时间             |
| `last_login_at`       | TIMESTAMP WITH TIME ZONE                                    | NULLABLE                                           | 最后登录时间         |
| `saas_enterprise_id`  | VARCHAR(255)                                                | FK to `SaasEnterprises(id)` ON DELETE SET NULL, NULLABLE | (外键) 所属SAAS企业ID (医生/企业员工) |
| `saas_department_id`  | VARCHAR(255)                                                | FK to `SaasDepartments(id)` ON DELETE SET NULL, NULLABLE | (外键) 所属SAAS部门ID (医生/企业员工) |
| `employee_number`     | VARCHAR(100)                                                | NULLABLE                                           | 员工工号 (企业内)    |
| `role_title`          | VARCHAR(100)                                                | NULLABLE                                           | 职位/角色名称 (企业内) |
| `join_date`           | DATE                                                        | NULLABLE                                           | 入职日期 (企业内)    |
| `system_role_id`      | VARCHAR(255)                                                | FK to `SaasSystemRoles(id)` ON DELETE SET NULL, NULLABLE | (外键) SAAS平台系统角色ID (saas_admin) |


### 2. `PatientProfiles` (病人档案表)
存储病人的详细个人信息和医疗背景。字段非常多，大部分为可空。

| 字段名                    | 数据类型        | 约束/注释                               | 中文注释                     |
| ------------------------- | --------------- | --------------------------------------- | ---------------------------- |
| `user_id`                 | VARCHAR(255)    | PK, FK to `Users(id)` ON DELETE CASCADE | 用户ID (主键, 外键)          |
| `record_number`           | VARCHAR(100)    | NULLABLE, UNIQUE                        | 病案号                       |
| `gender`                  | VARCHAR(10)     | CHECK (`gender` IN ('male', 'female', 'other')), NULLABLE | 性别                         |
| `date_of_birth`           | DATE            | NULLABLE                                | 出生日期                     |
| `marital_status`          | VARCHAR(20)     | CHECK (`marital_status` IN ('unmarried', 'married', 'divorced', 'widowed', 'other')), NULLABLE | 婚姻状况                     |
| `occupation`              | VARCHAR(100)    | NULLABLE                                | 职业                         |
| `nationality`             | VARCHAR(100)    | NULLABLE                                | 国籍                         |
| `birthplace`              | VARCHAR(255)    | NULLABLE                                | 出生地址                     |
| `address`                 | VARCHAR(255)    | NULLABLE                                | 家庭住址                     |
| `contact_email`           | VARCHAR(255)    | NULLABLE                                | 联系邮箱 (病人自填)          |
| `blood_type`              | VARCHAR(10)     | CHECK (`blood_type` IN ('A', 'B', 'O', 'AB', 'unknown')), NULLABLE | 血型                         |
| `education_level`         | VARCHAR(100)    | NULLABLE                                | 文化程度                     |
| `had_previous_checkup`    | BOOLEAN         | DEFAULT FALSE                           | 是否曾在本机构体检             |
| `agrees_to_intervention`  | BOOLEAN         | DEFAULT FALSE                           | 是否同意接受健康干预服务       |
| `admission_date`          | DATE            | NULLABLE                                | 入院日期                     |
| `record_date`             | DATE            | NULLABLE                                | 病史记录日期                 |
| `informant`               | VARCHAR(100)    | NULLABLE                                | 病史陈述者                   |
| `reliability`             | VARCHAR(50)     | CHECK (`reliability` IN ('reliable', 'partially_reliable', 'unreliable')), NULLABLE | 病史陈述可靠程度             |
| `chief_complaint`         | TEXT            | NULLABLE                                | 主诉                         |
| `history_of_present_illness` | TEXT            | NULLABLE                                | 现病史                       |
| `past_medical_history_details`| TEXT            | NULLABLE                                | 既往史详情 (文本)            |
| `past_illnesses_json`     | JSONB           | NULLABLE                                | 既往疾病列表 (JSON数组)      |
| `infectious_diseases_json`| JSONB           | NULLABLE                                | 传染病史列表 (JSON数组)      |
| `vaccination_history`     | TEXT            | NULLABLE                                | 预防接种史                   |
| `operation_history_json`  | JSONB           | NULLABLE                                | 手术史列表 (JSON数组)        |
| `trauma_history`          | TEXT            | NULLABLE                                | 外伤史                       |
| `blood_transfusion_history` | TEXT          | NULLABLE                                | 输血史                       |
| `personal_history_birth_place` | VARCHAR(255) | NULLABLE                               | 个人史-出生地与久居地      |
| `personal_history_living_conditions` | TEXT | NULLABLE                                | 个人史-生活条件              |
| `personal_history_drug_abuse` | TEXT        | NULLABLE                                | 个人史-药物滥用史            |
| `personal_history_menstrual_obstetric` | TEXT | NULLABLE                             | 个人史-月经婚育史 (女性)     |
| `allergies_json`          | JSONB           | NULLABLE                                | 过敏史列表 (JSON数组)        |
| `other_allergy_text`      | VARCHAR(255)    | NULLABLE                                | 其他过敏原说明               |
| `current_symptoms_json`   | JSONB           | NULLABLE                                | 当前症状列表 (JSON数组)      |
| `medication_categories_json` | JSONB        | NULLABLE                                | 主要用药类别 (JSON数组)      |
| `contact_history_json`    | JSONB           | NULLABLE                                | 接触史列表 (JSON数组)        |
| `dietary_habits_breakfast_days` | VARCHAR(50) | NULLABLE                               | 每周吃早餐天数               |
| `dietary_habits_late_snack_days` | VARCHAR(50) | NULLABLE                             | 每周吃夜宵天数               |
| `dietary_habits_bad_habits_json` | JSONB      | NULLABLE                               | 不良饮食习惯 (JSON数组)      |
| `dietary_habits_preferences_json` | JSONB    | NULLABLE                               | 饮食口味偏好 (JSON数组)      |
| `dietary_habits_food_type_prefs_json` | JSONB | NULLABLE                               | 食物类型偏好 (JSON数组)      |
| `dietary_intake_staple`   | VARCHAR(50)     | NULLABLE                                | 主食日均摄入量               |
| `dietary_intake_meat`     | VARCHAR(50)     | NULLABLE                                | 肉类日均摄入量               |
| `dietary_intake_fish`     | VARCHAR(50)     | NULLABLE                                | 鱼类日均摄入量               |
| `dietary_intake_eggs`     | VARCHAR(50)     | NULLABLE                                | 蛋类日均摄入量               |
| `dietary_intake_dairy`    | VARCHAR(50)     | NULLABLE                                | 奶类日均摄入量               |
| `dietary_intake_soy`      | VARCHAR(50)     | NULLABLE                                | 豆制品日均摄入量             |
| `dietary_intake_vegetables` | VARCHAR(50)   | NULLABLE                                | 蔬菜日均摄入量               |
| `dietary_intake_fruits`   | VARCHAR(50)     | NULLABLE                                | 水果日均摄入量               |
| `dietary_intake_water`    | VARCHAR(50)     | NULLABLE                                | 日均饮水摄入量               |
| `exercise_work_hours`     | VARCHAR(50)     | NULLABLE                                | 平均每日工作时间             |
| `exercise_sedentary_hours`| VARCHAR(50)     | NULLABLE                                | 平均每日静坐时间             |
| `exercise_weekly_frequency` | VARCHAR(50)   | NULLABLE                                | 每周运动频率                 |
| `exercise_duration_per_session` | VARCHAR(50)| NULLABLE                                | 每次运动时长                 |
| `exercise_intensity`      | VARCHAR(50)     | NULLABLE                                | 运动强度                     |
| `smoking_status`          | VARCHAR(50)     | NULLABLE                                | 吸烟状况                     |
| `smoking_cigarettes_per_day` | VARCHAR(50)  | NULLABLE                                | 日均吸烟量                   |
| `smoking_years`           | VARCHAR(50)     | NULLABLE                                | 总吸烟年数                   |
| `smoking_passive_days`    | VARCHAR(50)     | NULLABLE                                | 每周被动吸烟天数             |
| `drinking_status`         | VARCHAR(50)     | NULLABLE                                | 饮酒状况                     |
| `drinking_type`           | VARCHAR(50)     | NULLABLE                                | 常饮酒类型                   |
| `drinking_type_other`     | VARCHAR(255)    | NULLABLE                                | 其他饮酒类型说明             |
| `drinking_amount_per_day` | VARCHAR(50)     | NULLABLE                                | 日均饮酒量                   |
| `drinking_years`          | VARCHAR(50)     | NULLABLE                                | 总饮酒年数                   |
| `mental_health_major_events` | VARCHAR(10)  | NULLABLE                                | 重大意外困扰 (是/否)         |
| `mental_health_impact_on_life` | VARCHAR(50)| NULLABLE                                | 情绪对生活影响程度           |
| `mental_health_stress_level` | VARCHAR(50)  | NULLABLE                                | 精神压力感觉程度             |
| `mental_health_sas_anxiety` | VARCHAR(50)   | NULLABLE                                | SAS焦虑自评-焦虑             |
| `mental_health_sas_fear`    | VARCHAR(50)   | NULLABLE                                | SAS焦虑自评-害怕             |
| `mental_health_sas_panic`   | VARCHAR(50)   | NULLABLE                                | SAS焦虑自评-惊恐             |
| `mental_health_sas_going_crazy` | VARCHAR(50) | NULLABLE                              | SAS焦虑自评-发疯感           |
| `mental_health_sas_misfortune` | VARCHAR(50)| NULLABLE                                | SAS焦虑自评-不幸预感         |
| `mental_health_sas_trembling` | VARCHAR(50)| NULLABLE                                | SAS焦虑自评-手足颇抖         |
| `mental_health_sas_body_pain` | VARCHAR(50)| NULLABLE                                | SAS焦虑自评-躯体疼痛         |
| `mental_health_sas_fatigue` | VARCHAR(50)   | NULLABLE                                | SAS焦虑自评-乏力             |
| `mental_health_sas_restlessness` | VARCHAR(50)| NULLABLE                                | SAS焦虑自评-静坐不能         |
| `mental_health_sas_palpitations` | VARCHAR(50)| NULLABLE                                | SAS焦虑自评-心悸             |
| `mental_health_sas_dizziness` | VARCHAR(50) | NULLABLE                                | SAS焦虑自评-头昏             |
| `mental_health_sas_fainting` | VARCHAR(50)  | NULLABLE                                | SAS焦虑自评-晕厥感           |
| `mental_health_sas_breathing_difficulty` | VARCHAR(50) | NULLABLE                      | SAS焦虑自评-呼吸困难         |
| `mental_health_sas_paresthesia` | VARCHAR(50) | NULLABLE                               | SAS焦虑自评-手足刺痛         |
| `mental_health_sas_stomach_pain` | VARCHAR(50) | NULLABLE                              | SAS焦虑自评-胃痛或消化不良   |
| `mental_health_sas_frequent_urination` | VARCHAR(50) | NULLABLE                        | SAS焦虑自评-尿意频数         |
| `mental_health_sas_sweating`| VARCHAR(50)   | NULLABLE                                | SAS焦虑自评-多汗             |
| `adherence_self_assessment_body` | VARCHAR(50) | NULLABLE                             | 遵医行为-身体感觉评价        |
| `adherence_self_assessment_mind` | VARCHAR(50) | NULLABLE                             | 遵医行为-心理态度评价        |
| `adherence_priority_problems_json` | JSONB   | NULLABLE                               | 遵医行为-最希望解决的问题 (JSON数组) |
| `adherence_doctor_advice_compliance` | VARCHAR(50) | NULLABLE                         | 遵医行为-医嘱依从度          |
| `adherence_health_promotion_methods_json` | JSONB | NULLABLE                           | 遵医行为-希望促进健康方式 (JSON数组) |
| `adherence_other_health_promotion` | VARCHAR(255) | NULLABLE                         | 遵医行为-其他促进健康方式说明 |
| `sleep_adequacy`          | VARCHAR(50)     | NULLABLE                                | 睡眠充足情况                 |
| `other_info_medications_used` | TEXT        | NULLABLE                                | 其他-当前使用药物详细        |
| `other_info_contact_preference_method` | VARCHAR(50) | NULLABLE                       | 其他-联系偏好方式            |
| `other_info_contact_preference_method_other` | VARCHAR(255) | NULLABLE                 | 其他-联系偏好方式(其他说明)  |
| `other_info_contact_preference_frequency` | VARCHAR(50) | NULLABLE                    | 其他-联系偏好频率            |
| `other_info_contact_preference_frequency_other` | VARCHAR(255) | NULLABLE              | 其他-联系偏好频率(其他说明)  |
| `other_info_contact_preference_time` | VARCHAR(50) | NULLABLE                         | 其他-联系偏好时间            |
| `other_info_contact_preference_time_other` | VARCHAR(255) | NULLABLE                   | 其他-联系偏好时间(其他说明)  |
| `other_info_suggestions`  | TEXT            | NULLABLE                                | 其他-对中心建议              |
| `other_info_service_satisfaction` | VARCHAR(50) | NULLABLE                           | 其他-服务满意度              |
| `managing_doctor_id`      | VARCHAR(255)    | FK to `Users(id)` ON DELETE SET NULL, NULLABLE | (外键)主管医生ID             |

### 3. `PatientFamilyMedicalHistory` (病人家族病史表)
存储病人的结构化家族病史。

| 字段名            | 数据类型     | 约束/注释                                   | 中文注释             |
| ----------------- | ------------ | ------------------------------------------- | -------------------- |
| `id`              | VARCHAR(255) | PK (主键)                                   | 记录ID               |
| `patient_user_id` | VARCHAR(255) | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人用户ID     |
| `relative_type`   | VARCHAR(50)  | NOT NULL, CHECK (`relative_type` IN ('self', 'father', 'mother', 'paternal_grandparents', 'maternal_grandparents')) | 亲属关系             |
| `condition_name`  | VARCHAR(100) | NOT NULL                                    | 疾病名称             |
| `notes`           | TEXT         | NULLABLE                                    | 备注                 |

### 4. `PatientMedicationHistory` (病人用药史表)
存储病人的详细用药记录。

| 字段名            | 数据类型     | 约束/注释                                   | 中文注释           |
| ----------------- | ------------ | ------------------------------------------- | ------------------ |
| `id`              | VARCHAR(255) | PK (主键)                                   | 用药记录ID         |
| `patient_user_id` | VARCHAR(255) | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人用户ID   |
| `drug_name`       | VARCHAR(255) | NOT NULL                                    | 药物名称           |
| `dosage`          | VARCHAR(100) | NOT NULL                                    | 剂量               |
| `frequency`       | VARCHAR(100) | NOT NULL                                    | 服用频率           |
| `start_date`      | DATE         | NULLABLE                                    | 开始服用日期       |
| `end_date`        | DATE         | NULLABLE                                    | 结束服用日期 (可选) |
| `notes`           | TEXT         | NULLABLE                                    | 备注               |

### 5. `EmergencyContacts` (紧急联系人表)

| 字段名           | 数据类型     | 约束/注释                                   | 中文注释       |
| ---------------- | ------------ | ------------------------------------------- | -------------- |
| `id`             | VARCHAR(255) | PK (主键)                                   | 紧急联系人ID   |
| `patient_user_id`| VARCHAR(255) | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人用户ID |
| `name`           | VARCHAR(100) | NOT NULL                                    | 联系人姓名     |
| `relationship`   | VARCHAR(50)  | NOT NULL                                    | 与病人关系     |
| `phone_number`   | VARCHAR(20)  | NOT NULL                                    | 联系人电话     |
| `created_at`     | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建时间       |

### 6. `DoctorProfiles` (医生档案表)
(注意: 医生信息大部分已合并到 `Users` 表中 `user_type='doctor'` 的记录，此表可用于存储医生特有的、非认证相关的额外信息。)

| 字段名                  | 数据类型     | 约束/注释                                   | 中文注释         |
| ----------------------- | ------------ | ------------------------------------------- | ---------------- |
| `user_id`               | VARCHAR(255) | PK, FK to `Users(id)` ON DELETE CASCADE   | 用户ID (主键, 外键) |
| `specialty`             | VARCHAR(100) | NULLABLE                                    | 专业             |
| `bio`                   | TEXT         | NULLABLE                                    | 个人简介/擅长    |
| `hospital_affiliation`  | VARCHAR(255) | NULLABLE (SAAS模式下通常通过`Users.saas_enterprise_id`关联) | 所属医院/机构    |
| `license_number`        | VARCHAR(100) | NULLABLE (已移至`Users`表，可考虑删除此字段) | 执业医师编号     |
| `years_of_experience`   | INT          | NULLABLE (可考虑移至`Users`表)             | 执业年限         |


## 健康数据与记录

### 7. `HealthDataRecords` (健康数据记录表)

| 字段名            | 数据类型        | 约束/注释                                   | 中文注释                   |
| ----------------- | --------------- | ------------------------------------------- | -------------------------- |
| `id`              | VARCHAR(255)    | PK (主键)                                   | 记录ID                     |
| `patient_user_id` | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人用户ID           |
| `record_type`     | VARCHAR(50)     | NOT NULL, CHECK (`record_type` IN ('blood_sugar', 'blood_pressure', 'weight', 'lipids', 'exercise', 'activity')) | 记录类型                   |
| `recorded_at`     | TIMESTAMP WITH TIME ZONE | NOT NULL                               | 记录时间                   |
| `value_numeric1`  | DECIMAL(10,2)   | NULLABLE                                    | 数值1 (血糖, 收缩压, 体重) |
| `value_numeric2`  | DECIMAL(10,2)   | NULLABLE                                    | 数值2 (舒张压)             |
| `value_numeric3`  | DECIMAL(10,2)   | NULLABLE                                    | 数值3 (心率)               |
| `value_numeric4`  | DECIMAL(10,2)   | NULLABLE                                    | 数值4 (LDL)                |
| `unit1`           | VARCHAR(20)     | NULLABLE                                    | 单位1 (mmol/L, mmHg, kg)   |
| `unit2`           | VARCHAR(20)     | NULLABLE                                    | 单位2                      |
| `value_text`      | VARCHAR(255)    | NULLABLE                                    | 文本值 (运动类型, 步数)    |
| `notes`           | TEXT            | NULLABLE                                    | 备注 (餐前/餐后, 运动详情) |
| `source`          | VARCHAR(20)     | DEFAULT 'manual', CHECK (`source` IN ('manual', 'device_sync')) | 数据来源                   |
| `device_id`       | VARCHAR(100)    | NULLABLE                                    | 设备ID (若同步)            |
| `created_at`      | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建时间                   |

### 8. `ExaminationReports` (检查报告表)

| 字段名              | 数据类型        | 约束/注释                                   | 中文注释           |
| ------------------- | --------------- | ------------------------------------------- | ------------------ |
| `id`                | VARCHAR(255)    | PK (主键)                                   | 报告ID             |
| `patient_user_id`   | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人用户ID   |
| `doctor_user_id`    | VARCHAR(255)    | FK to `Users(id)` ON DELETE SET NULL, NULLABLE | (外键) 上传医生ID   |
| `report_name`       | VARCHAR(255)    | NOT NULL                                    | 报告名称           |
| `report_type`       | VARCHAR(20)     | NOT NULL, CHECK (`report_type` IN ('image', 'pdf', 'other')) | 文件类型           |
| `file_url`          | VARCHAR(255)    | NOT NULL                                    | 文件存储URL        |
| `upload_date`       | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 上传日期           |
| `description`       | TEXT            | NULLABLE                                    | 报告描述           |
| `report_date`       | DATE            | NULLABLE                                    | 报告实际检查日期   |

### 9. `DietRecords` (饮食记录表)

| 字段名             | 数据类型        | 约束/注释                                   | 中文注释           |
| ------------------ | --------------- | ------------------------------------------- | ------------------ |
| `id`               | VARCHAR(255)    | PK (主键)                                   | 记录ID             |
| `patient_user_id`  | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人用户ID   |
| `meal_type`        | VARCHAR(20)     | NOT NULL, CHECK (`meal_type` IN ('breakfast', 'lunch', 'dinner', 'snack')) | 膳食类型           |
| `recorded_at`      | TIMESTAMP WITH TIME ZONE | NOT NULL                               | 记录时间           |
| `notes`            | TEXT            | NULLABLE                                    | 备注               |
| `total_calories`   | INT             | NULLABLE                                    | 总热量 (千卡)      |
| `total_protein`    | DECIMAL(10,2)   | NULLABLE                                    | 总蛋白质 (克)      |
| `total_carbs`      | DECIMAL(10,2)   | NULLABLE                                    | 总碳水化合物 (克)  |
| `total_fat`        | DECIMAL(10,2)   | NULLABLE                                    | 总脂肪 (克)        |
| `created_at`       | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建时间           |

### 10. `DietRecordItems` (饮食记录条目表)

| 字段名                 | 数据类型     | 约束/注释                                   | 中文注释             |
| ---------------------- | ------------ | ------------------------------------------- | -------------------- |
| `id`                   | VARCHAR(255) | PK (主键)                                   | 条目ID               |
| `diet_record_id`       | VARCHAR(255) | FK to `DietRecords(id)` ON DELETE CASCADE, NOT NULL | (外键) 饮食记录ID     |
| `food_name`            | VARCHAR(255) | NOT NULL                                    | 食物名称             |
| `quantity_description` | VARCHAR(100) | NOT NULL                                    | 份量描述 (例如: 1碗) |
| `calories`             | INT          | NULLABLE                                    | 热量 (千卡)          |
| `protein`              | DECIMAL(10,2)| NULLABLE                                    | 蛋白质 (克)          |
| `carbs`                | DECIMAL(10,2)| NULLABLE                                    | 碳水化合物 (克)      |
| `fat`                  | DECIMAL(10,2)| NULLABLE                                    | 脂肪 (克)            |
| `food_database_id`     | VARCHAR(255) | FK to `FoodDatabase(id)` ON DELETE SET NULL, NULLABLE | (外键) 食物库条目ID   |

### 11. `FoodDatabase` (食物数据库表)

| 字段名              | 数据类型     | 约束/注释                                   | 中文注释         |
| ------------------- | ------------ | ------------------------------------------- | ---------------- |
| `id`                | VARCHAR(255) | PK (主键)                                   | 食物ID           |
| `name`              | VARCHAR(255) | NOT NULL, UNIQUE                            | 食物名称         |
| `calories_per_100g` | INT          | NULLABLE                                    | 每100克热量      |
| `protein_per_100g`  | DECIMAL(10,2)| NULLABLE                                    | 每100克蛋白质    |
| `carbs_per_100g`    | DECIMAL(10,2)| NULLABLE                                    | 每100克碳水      |
| `fat_per_100g`      | DECIMAL(10,2)| NULLABLE                                    | 每100克脂肪      |
| `unit_description`  | VARCHAR(50)  | DEFAULT '100g'                              | 单位描述         |
| `created_by_user_id`| VARCHAR(255) | FK to `Users(id)` ON DELETE SET NULL, NULLABLE | (外键) 创建用户ID |

## 互动与提醒

### 12. `Consultations` (医患咨询表)

| 字段名                | 数据类型        | 约束/注释                                   | 中文注释         |
| --------------------- | --------------- | ------------------------------------------- | ---------------- |
| `id`                  | VARCHAR(255)    | PK (主键)                                   | 咨询ID           |
| `patient_user_id`     | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人用户ID |
| `doctor_user_id`      | VARCHAR(255)    | FK to `Users(id)` ON DELETE SET NULL, NULLABLE | (外键) 医生用户ID |
| `question`            | TEXT            | NOT NULL                                    | 病人问题         |
| `status`              | VARCHAR(50)     | NOT NULL, CHECK (`status` IN ('pending_reply', 'replied', 'closed', 'scheduled', 'pending_confirmation')) | 状态             |
| `created_at`          | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 病人发起时间     |
| `doctor_reply_at`     | TIMESTAMP WITH TIME ZONE | NULLABLE                                | 医生回复时间     |
| `updated_at`          | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 最后更新时间     |

### 13. `ConsultationMessages` (咨询消息表)

| 字段名                | 数据类型        | 约束/注释                                   | 中文注释           |
| --------------------- | --------------- | ------------------------------------------- | ------------------ |
| `id`                  | VARCHAR(255)    | PK (主键)                                   | 消息ID             |
| `consultation_id`     | VARCHAR(255)    | FK to `Consultations(id)` ON DELETE CASCADE, NOT NULL | (外键) 咨询ID       |
| `sender_user_id`      | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 发送者ID     |
| `message_content`     | TEXT            | NOT NULL                                    | 消息内容           |
| `message_type`        | VARCHAR(20)     | DEFAULT 'text', CHECK (`message_type` IN ('text', 'image', 'video', 'file', 'audio')) | 消息类型           |
| `file_url`            | VARCHAR(255)    | NULLABLE (非文本消息)                       | 文件URL            |
| `sent_at`             | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP      | 发送时间           |

### 14. `Reminders` (提醒表 - 通用)

| 字段名                | 数据类型        | 约束/注释                                   | 中文注释         |
| --------------------- | --------------- | ------------------------------------------- | ---------------- |
| `id`                  | VARCHAR(255)    | PK (主键)                                   | 提醒ID           |
| `patient_user_id`     | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人用户ID |
| `reminder_type`       | VARCHAR(50)     | NOT NULL, CHECK (`reminder_type` IN ('medication', 'checkup', 'appointment', 'custom')) | 提醒类型         |
| `title`               | VARCHAR(255)    | NOT NULL                                    | 提醒标题         |
| `description`         | TEXT            | NULLABLE                                    | 提醒描述         |
| `due_datetime`        | TIMESTAMP WITH TIME ZONE | NOT NULL                               | 到期/提醒时间    |
| `frequency_cron`      | VARCHAR(100)    | NULLABLE (如: '0 8 * * *')                | 重复频率(CRON)   |
| `is_enabled`          | BOOLEAN         | DEFAULT TRUE                                | 是否启用         |
| `last_triggered_at`   | TIMESTAMP WITH TIME ZONE | NULLABLE                               | 上次触发时间     |
| `created_at`          | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建时间         |

### 15. `ReminderLogs` (提醒执行记录表)

| 字段名         | 数据类型        | 约束/注释                                   | 中文注释       |
| -------------- | --------------- | ------------------------------------------- | -------------- |
| `id`           | VARCHAR(255)    | PK (主键)                                   | 记录ID         |
| `reminder_id`  | VARCHAR(255)    | FK to `Reminders(id)` ON DELETE CASCADE, NOT NULL | (外键) 提醒ID   |
| `action_taken` | VARCHAR(20)     | NOT NULL, CHECK (`action_taken` IN ('taken', 'skipped', 'done', 'missed')) | 执行动作       |
| `action_time`  | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 执行时间       |
| `notes`        | TEXT            | NULLABLE                                    | 备注           |

## 扩展功能 (病人端)

### 16. `HealthCourses` (健康课程表)

| 字段名            | 数据类型        | 约束/注释                                   | 中文注释       |
| ----------------- | --------------- | ------------------------------------------- | -------------- |
| `id`              | VARCHAR(255)    | PK (主键)                                   | 课程ID         |
| `title`           | VARCHAR(255)    | NOT NULL                                    | 课程标题       |
| `description`     | TEXT            | NULLABLE                                    | 课程描述       |
| `category`        | VARCHAR(100)    | NULLABLE                                    | 课程分类       |
| `duration_text`   | VARCHAR(100)    | NULLABLE                                    | 课程时长文本   |
| `image_url`       | VARCHAR(255)    | NULLABLE                                    | 课程封面图URL  |
| `content_url`     | VARCHAR(255)    | NULLABLE (或关联内容表)                     | 课程内容URL    |
| `created_at`      | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建时间       |

### 17. `PatientCourseEnrollments` (病人课程报名表)

| 字段名                 | 数据类型        | 约束/注释                                   | 中文注释     |
| ---------------------- | --------------- | ------------------------------------------- | ------------ |
| `id`                   | VARCHAR(255)    | PK (主键)                                   | 报名ID       |
| `patient_user_id`      | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人ID |
| `course_id`            | VARCHAR(255)    | FK to `HealthCourses(id)` ON DELETE CASCADE, NOT NULL | (外键) 课程ID |
| `enrollment_date`      | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP  | 报名时间     |
| `progress_percentage`  | INT             | DEFAULT 0, CHECK (`progress_percentage` BETWEEN 0 AND 100) | 学习进度 (%) |
| `status`               | VARCHAR(20)     | DEFAULT 'enrolled', CHECK (`status` IN ('enrolled', 'in_progress', 'completed')) | 学习状态     |

### 18. `CommunityPosts` (社区帖子表)

| 字段名          | 数据类型        | 约束/注释                                   | 中文注释   |
| --------------- | --------------- | ------------------------------------------- | ---------- |
| `id`            | VARCHAR(255)    | PK (主键)                                   | 帖子ID     |
| `author_user_id`| VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 作者ID |
| `content`       | TEXT            | NOT NULL                                    | 帖子内容   |
| `created_at`    | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 发布时间   |
| `updated_at`    | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 更新时间   |
| `likes_count`   | INT             | DEFAULT 0                                   | 点赞数     |

### 19. `CommunityComments` (社区评论表)

| 字段名              | 数据类型        | 约束/注释                                   | 中文注释         |
| ------------------- | --------------- | ------------------------------------------- | ---------------- |
| `id`                | VARCHAR(255)    | PK (主键)                                   | 评论ID           |
| `post_id`           | VARCHAR(255)    | FK to `CommunityPosts(id)` ON DELETE CASCADE, NOT NULL | (外键) 帖子ID     |
| `author_user_id`    | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 评论者ID   |
| `parent_comment_id` | VARCHAR(255)    | FK to `CommunityComments(id)` ON DELETE CASCADE, NULLABLE | (外键) 父评论ID   |
| `content`           | TEXT            | NOT NULL                                    | 评论内容         |
| `created_at`        | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 发布时间         |

## 医生端特定功能

### 20. `Appointments` (预约表)

| 字段名                  | 数据类型        | 约束/注释                                   | 中文注释     |
| ----------------------- | --------------- | ------------------------------------------- | ------------ |
| `id`                    | VARCHAR(255)    | PK (主键)                                   | 预约ID       |
| `patient_user_id`       | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人ID |
| `doctor_user_id`        | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 医生ID |
| `appointment_datetime`  | TIMESTAMP WITH TIME ZONE | NOT NULL                               | 预约日期时间 |
| `duration_minutes`      | INT             | DEFAULT 30                                  | 预约时长(分钟) |
| `reason`                | TEXT            | NULLABLE                                    | 预约事由     |
| `status`                | VARCHAR(50)     | NOT NULL, CHECK (`status` IN ('scheduled', 'completed', 'cancelled_by_patient', 'cancelled_by_doctor', 'pending_confirmation')) | 预约状态     |
| `notes_patient`         | TEXT            | NULLABLE                                    | 病人备注     |
| `notes_doctor`          | TEXT            | NULLABLE                                    | 医生备注     |
| `created_at`            | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建时间     |
| `updated_at`            | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 更新时间     |

### 21. `TreatmentPlans` (治疗方案表)

| 字段名                   | 数据类型        | 约束/注释                                   | 中文注释         |
| ------------------------ | --------------- | ------------------------------------------- | ---------------- |
| `id`                     | VARCHAR(255)    | PK (主键)                                   | 方案ID           |
| `patient_user_id`        | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人ID     |
| `doctor_user_id`         | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 制定医生ID |
| `plan_name`              | VARCHAR(255)    | DEFAULT '默认治疗方案'                      | 方案名称         |
| `start_date`             | DATE            | NOT NULL                                    | 开始日期         |
| `end_date`               | DATE            | NULLABLE                                    | 结束日期 (可选)  |
| `short_term_goals`       | TEXT            | NULLABLE                                    | 短期目标         |
| `long_term_goals`        | TEXT            | NULLABLE                                    | 长期目标         |
| `lifestyle_adjustments`  | TEXT            | NULLABLE                                    | 生活方式调整建议 |
| `is_active`              | BOOLEAN         | DEFAULT TRUE                                | 是否当前激活方案 |
| `created_at`             | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建时间         |
| `updated_at`             | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 更新时间         |

### 22. `TreatmentPlanMedications` (治疗方案药物表)

| 字段名              | 数据类型     | 约束/注释                                   | 中文注释           |
| ------------------- | ------------ | ------------------------------------------- | ------------------ |
| `id`                | VARCHAR(255) | PK (主键)                                   | ID                 |
| `treatment_plan_id` | VARCHAR(255) | FK to `TreatmentPlans(id)` ON DELETE CASCADE, NOT NULL | (外键) 治疗方案ID   |
| `drug_name`         | VARCHAR(255) | NOT NULL                                    | 药物名称           |
| `dosage`            | VARCHAR(100) | NOT NULL                                    | 剂量               |
| `frequency`         | VARCHAR(100) | NOT NULL                                    | 服用频率           |
| `notes`             | TEXT         | NULLABLE                                    | 服用备注           |
| `start_date`        | DATE         | NOT NULL                                    | 开始服用日期       |
| `end_date`          | DATE         | NULLABLE                                    | 结束服用日期 (可选) |

### 23. `TreatmentAdvices` (治疗建议记录表)

| 字段名                   | 数据类型        | 约束/注释                                   | 中文注释           |
| ------------------------ | --------------- | ------------------------------------------- | ------------------ |
| `id`                     | VARCHAR(255)    | PK (主键)                                   | 建议ID             |
| `patient_user_id`        | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 病人ID       |
| `doctor_user_id`         | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键) 建议医生ID   |
| `treatment_plan_id`      | VARCHAR(255)    | FK to `TreatmentPlans(id)` ON DELETE SET NULL, NULLABLE | (外键) 关联治疗方案ID |
| `advice_content`         | TEXT            | NOT NULL                                    | 建议内容           |
| `advice_date`            | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP  | 建议发出时间       |
| `patient_feedback_status`| VARCHAR(50)     | DEFAULT 'pending', CHECK (`patient_feedback_status` IN ('pending', 'acknowledged', 'implemented', 'rejected')) | 病人执行状态/反馈    |
| `patient_feedback_notes` | TEXT            | NULLABLE                                    | 病人反馈备注       |

### 24. `DoctorPatientMessages` (医患消息推送表 - 医生端发起)

| 字段名                 | 数据类型        | 约束/注释                                   | 中文注释             |
| ---------------------- | --------------- | ------------------------------------------- | -------------------- |
| `id`                   | VARCHAR(255)    | PK (主键)                                   | 消息ID               |
| `sender_doctor_id`     | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NOT NULL | (外键)发送医生ID     |
| `recipient_patient_id` | VARCHAR(255)    | FK to `Users(id)` ON DELETE CASCADE, NULLABLE | (外键)接收病人ID     |
| `recipient_group_id`   | VARCHAR(255)    | FK to `OutboundCallGroups(id)` ON DELETE CASCADE, NULLABLE | (外键)接收群组ID     |
| `title`                | VARCHAR(255)    | NOT NULL                                    | 消息标题             |
| `content`              | TEXT            | NOT NULL                                    | 消息内容             |
| `sent_at`              | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 发送时间             |
| `read_count`           | INT             | DEFAULT 0                                   | 阅读数量 (用于群组)  |
| `delivery_status`      | VARCHAR(50)     | DEFAULT 'sent'                              | 发送状态             |

## SAAS 管理后台表结构

### 25. `SaasEnterprises` (SAAS企业/医院表)

| 字段名                   | 数据类型        | 约束/注释                                   | 中文注释               |
| ------------------------ | --------------- | ------------------------------------------- | ---------------------- |
| `id`                     | VARCHAR(255)    | PK (主键)                                   | 企业ID                 |
| `name`                   | VARCHAR(255)    | NOT NULL, UNIQUE                            | 企业名称               |
| `contact_person`         | VARCHAR(100)    | NOT NULL                                    | 联系人                 |
| `contact_email`          | VARCHAR(255)    | NOT NULL, UNIQUE                            | 联系邮箱               |
| `contact_phone`          | VARCHAR(20)     | NOT NULL                                    | 联系电话               |
| `address`                | VARCHAR(255)    | NULLABLE                                    | 地址                   |
| `status`                 | VARCHAR(50)     | NOT NULL, DEFAULT 'pending_approval', CHECK (`status` IN ('active', 'inactive', 'pending_approval', 'suspended')) | 账户状态               |
| `creation_date`          | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建日期               |
| `assigned_resources`     | JSONB           | NULLABLE                                    | 分配资源 (如: {"maxUsers": 50, "maxStorageGB": 100, "maxPatients": 5000}) |
| `current_users_count`    | INT             | DEFAULT 0                                   | 当前用户数 (员工)      |
| `current_patients_count` | INT             | DEFAULT 0                                   | 当前病人数量           |
| `notes`                  | TEXT            | NULLABLE                                    | 备注                   |
| `service_package_id`     | VARCHAR(255)    | FK to `SaasServicePackages(id)` ON DELETE SET NULL, NULLABLE | (外键) 订阅的服务包ID   |

### 26. `SaasDepartments` (SAAS企业部门表)

| 字段名                    | 数据类型        | 约束/注释                                   | 中文注释           |
| ------------------------- | --------------- | ------------------------------------------- | ------------------ |
| `id`                      | VARCHAR(255)    | PK (主键)                                   | 部门ID             |
| `saas_enterprise_id`      | VARCHAR(255)    | FK to `SaasEnterprises(id)` ON DELETE CASCADE, NOT NULL | (外键) 所属企业ID   |
| `name`                    | VARCHAR(100)    | NOT NULL                                    | 部门名称           |
| `parent_department_id`    | VARCHAR(255)    | FK to `SaasDepartments(id)` ON DELETE SET NULL, NULLABLE | (外键) 上级部门ID   |
| `head_employee_user_id`   | VARCHAR(255)    | FK to `Users(id)` ON DELETE SET NULL, NULLABLE | (外键) 负责人用户ID |
| `description`             | TEXT            | NULLABLE                                    | 部门描述           |
| `creation_date`           | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建日期           |

### 27. `SaasSystemRoles` (SAAS平台系统角色表)

| 字段名        | 数据类型     | 约束/注释                           | 中文注释             |
| ------------- | ------------ | ----------------------------------- | -------------------- |
| `id`          | VARCHAR(255) | PK (主键)                           | 角色ID               |
| `name`        | VARCHAR(100) | NOT NULL, UNIQUE                    | 角色名称 (如:超管) |
| `description` | TEXT         | NULLABLE                            | 角色描述             |
| `permissions` | JSONB        | NOT NULL (权限标识符数组JSON)        | 权限列表             |

### 28. `SaasServicePackages` (SAAS服务包表)

| 字段名                 | 数据类型        | 约束/注释                                   | 中文注释             |
| ---------------------- | --------------- | ------------------------------------------- | -------------------- |
| `id`                   | VARCHAR(255)    | PK (主键)                                   | 服务包ID             |
| `name`                 | VARCHAR(255)    | NOT NULL, UNIQUE                            | 服务包名称           |
| `type`                 | VARCHAR(50)     | NOT NULL, CHECK (`type` IN ('basic', 'standard', 'premium', 'custom')) | 类型                 |
| `price_monthly`        | DECIMAL(10,2)   | NOT NULL                                    | 月度价格 (元)        |
| `price_annually`       | DECIMAL(10,2)   | NULLABLE                                    | 年度价格 (元)        |
| `features_json`        | JSONB           | NOT NULL (功能特性列表JSON数组)             | 功能特性             |
| `highlights`           | TEXT            | NULLABLE                                    | 亮点说明             |
| `max_users_limit`      | INT             | NOT NULL                                    | 此包最大用户数       |
| `max_storage_gb_limit` | INT             | NOT NULL                                    | 此包最大存储 (GB)    |
| `max_patients_limit`   | INT             | NOT NULL                                    | 此包最大病人额度     |
| `is_enabled`           | BOOLEAN         | DEFAULT TRUE                                | 是否启用销售         |
| `created_at`           | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建时间             |

### 29. `SaasOrders` (SAAS订单表)

| 字段名                    | 数据类型        | 约束/注释                                   | 中文注释             |
| ------------------------- | --------------- | ------------------------------------------- | -------------------- |
| `id`                      | VARCHAR(255)    | PK (主键)                                   | 订单ID               |
| `saas_enterprise_id`      | VARCHAR(255)    | FK to `SaasEnterprises(id)` ON DELETE CASCADE, NOT NULL | (外键) 购买企业ID     |
| `saas_service_package_id` | VARCHAR(255)    | FK to `SaasServicePackages(id)` ON DELETE RESTRICT, NOT NULL | (外键) 购买服务包ID   |
| `order_date`              | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP  | 订单日期             |
| `payment_status`          | VARCHAR(50)     | NOT NULL, CHECK (`payment_status` IN ('pending', 'paid', 'failed', 'refunded', 'processing')) | 支付状态             |
| `amount`                  | DECIMAL(10,2)   | NOT NULL                                    | 订单金额             |
| `currency`                | VARCHAR(10)     | DEFAULT 'CNY'                               | 货币                 |
| `transaction_id`          | VARCHAR(255)    | NULLABLE, UNIQUE                            | 交易ID               |
| `billing_cycle`           | VARCHAR(20)     | NOT NULL, CHECK (`billing_cycle` IN ('monthly', 'annually', 'one-time')) | 计费周期             |
| `renewal_date`            | DATE            | NULLABLE                                    | 下次续费日期 (若适用) |
| `invoice_number`          | VARCHAR(100)    | NULLABLE                                    | 发票号               |
| `notes`                   | TEXT            | NULLABLE                                    | 订单备注             |

### 30. `SaasPlatformConnections` (SAAS平台连接表 - 如微信机器人)

| 字段名                  | 数据类型        | 约束/注释                                   | 中文注释                 |
| ----------------------- | --------------- | ------------------------------------------- | ------------------------ |
| `id`                    | VARCHAR(255)    | PK (主键)                                   | 连接ID                   |
| `enterprise_id`         | VARCHAR(255)    | FK to `SaasEnterprises(id)`, NULLABLE       | 所属企业 (若特定于企业)   |
| `platform`              | VARCHAR(50)     | NOT NULL, CHECK (`platform` IN ('wechat_personal_bot', 'wechat_enterprise_app', 'other')) | 平台类型                 |
| `account_name`          | VARCHAR(255)    | NOT NULL                                    | 账号/应用名称            |
| `status`                | VARCHAR(50)     | NOT NULL, CHECK (`status` IN ('connected', 'disconnected', 'error', 'requires_reauth', 'pending_setup')) | 连接状态                 |
| `last_sync`             | TIMESTAMP WITH TIME ZONE | NULLABLE                               | 上次同步时间             |
| `associated_employee_id`| VARCHAR(255)    | FK to `Users(id)`, NULLABLE                 | 关联员工ID (如个人Bot)   |
| `notes`                 | TEXT            | NULLABLE                                    | 备注                     |
| `created_at`            | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建时间                 |

### 31. `SaasCommunityGroups` (SAAS社群组表 - 如微信群)

| 字段名                  | 数据类型        | 约束/注释                                   | 中文注释                   |
| ----------------------- | --------------- | ------------------------------------------- | -------------------------- |
| `id`                    | VARCHAR(255)    | PK (主键)                                   | 社群组ID                   |
| `name`                  | VARCHAR(255)    | NOT NULL                                    | 群名称                     |
| `enterprise_id`         | VARCHAR(255)    | FK to `SaasEnterprises(id)`, NOT NULL       | 所属企业ID                 |
| `managing_employee_id`  | VARCHAR(255)    | FK to `Users(id)`, NULLABLE                 | 管理员工ID                 |
| `type`                  | VARCHAR(50)     | NOT NULL, CHECK (`type` IN ('personal_wechat_group', 'enterprise_wechat_group', 'other_platform_group')) | 群类型                     |
| `platform_group_id`     | VARCHAR(255)    | NULLABLE, UNIQUE                            | 平台外部群ID               |
| `description`           | TEXT            | NULLABLE                                    | 群描述                     |
| `member_patient_ids_json` | JSONB         | NULLABLE                                    | 群成员病人ID列表 (JSON)    |
| `patient_count`         | INT             | DEFAULT 0                                   | 病人成员数量               |
| `platform_connection_id`| VARCHAR(255)    | FK to `SaasPlatformConnections(id)`, NULLABLE | 关联的平台连接ID           |
| `connection_status`     | VARCHAR(50)     | NOT NULL, CHECK (`connection_status` IN ('active_sync', 'inactive_sync', 'error_sync', 'not_monitored')) | 群日志同步状态             |
| `last_log_sync`         | TIMESTAMP WITH TIME ZONE | NULLABLE                               | 上次聊天日志同步时间       |
| `creation_date`         | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建日期                   |
| `tags_json`             | JSONB           | NULLABLE                                    | 标签 (JSON数组)            |


### 32. `SaasCommunityMessageLogs` (SAAS社群消息日志表)

| 字段名                 | 数据类型        | 约束/注释                                   | 中文注释             |
| ---------------------- | --------------- | ------------------------------------------- | -------------------- |
| `id`                   | VARCHAR(255)    | PK (主键)                                   | 日志ID               |
| `community_group_id`   | VARCHAR(255)    | FK to `SaasCommunityGroups(id)`, NOT NULL   | 所属社群组ID         |
| `platform`             | VARCHAR(50)     | NOT NULL, (e.g., 'wechat_personal', 'wechat_enterprise') | 平台                 |
| `platform_group_id_external`| VARCHAR(255)| NULLABLE                                    | 平台外部群ID         |
| `platform_message_id_external`| VARCHAR(255)| NOT NULL, UNIQUE                            | 平台外部消息ID       |
| `sender_platform_id`   | VARCHAR(255)    | NOT NULL                                    | 发送者平台ID         |
| `sender_saas_user_id`  | VARCHAR(255)    | FK to `Users(id)`, NULLABLE                 | 发送者SAAS用户ID (若匹配) |
| `sender_name_display`  | VARCHAR(255)    | NOT NULL                                    | 发送者显示名称       |
| `message_content`      | TEXT            | NOT NULL                                    | 消息内容 (文本)    |
| `message_type`         | VARCHAR(50)     | NOT NULL, CHECK (`message_type` IN ('text', 'image', 'file', 'voice', 'system_notification', 'video')) | 消息内容类型         |
| `file_url`             | VARCHAR(255)    | NULLABLE                                    | 文件/媒体URL         |
| `timestamp`            | TIMESTAMP WITH TIME ZONE | NOT NULL                               | 消息原始时间戳       |
| `logged_at`            | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 日志记录时间         |
| `is_bot_message`       | BOOLEAN         | DEFAULT FALSE                               | 是否为机器人消息     |
| `metadata_json`        | JSONB           | NULLABLE                                    | 其他元数据 (JSON)   |

### 33. `SaasSopServices` (SAAS SOP服务配置表)

| 字段名                | 数据类型        | 约束/注释                                   | 中文注释           |
| --------------------- | --------------- | ------------------------------------------- | ------------------ |
| `id`                  | VARCHAR(255)    | PK (主键)                                   | 服务ID             |
| `name`                | VARCHAR(255)    | NOT NULL                                    | 服务名称           |
| `type`                | VARCHAR(20)     | NOT NULL, CHECK (`type` IN ('Coze', 'Dify', 'Other')) | 服务类型           |
| `api_endpoint`        | VARCHAR(255)    | NOT NULL                                    | API端点URL         |
| `api_key`             | VARCHAR(512)    | NULLABLE (建议加密存储)                      | API密钥            |
| `description`         | TEXT            | NULLABLE                                    | 服务描述           |
| `status`              | VARCHAR(20)     | NOT NULL, CHECK (`status` IN ('active', 'inactive', 'error')) | 服务状态           |
| `parameters_json`     | JSONB           | NULLABLE (固定参数JSON)                     | 固定参数           |
| `creation_date`       | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建日期           |
| `last_call_timestamp` | TIMESTAMP WITH TIME ZONE | NULLABLE                               | 最近调用时间       |
| `call_count`          | INT             | DEFAULT 0                                   | 总调用次数         |
| `error_count`         | INT             | DEFAULT 0                                   | 错误次数           |

### 34. `SaasAiWorkflowApiConfigs` (SAAS AI工作流API配置表)

| 字段名                  | 数据类型        | 约束/注释                                   | 中文注释               |
| ----------------------- | --------------- | ------------------------------------------- | ---------------------- |
| `id`                    | VARCHAR(255)    | PK (主键)                                   | 配置ID                 |
| `name`                  | VARCHAR(255)    | NOT NULL                                    | 工作流名称             |
| `type`                  | VARCHAR(20)     | NOT NULL, CHECK (`type` IN ('Dify', 'Coze', 'Other')) | 工作流平台类型         |
| `api_endpoint`          | VARCHAR(255)    | NOT NULL                                    | API端点URL             |
| `api_key`               | VARCHAR(512)    | NULLABLE (建议加密存储)                     | API密钥 (可选)         |
| `parameters_json`       | JSONB           | NULLABLE                                    | 默认参数 (JSON格式)    |
| `description`           | TEXT            | NULLABLE                                    | 工作流描述             |
| `status`                | VARCHAR(20)     | NOT NULL, DEFAULT 'active', CHECK (`status` IN ('active', 'inactive')) | 状态                   |
| `creation_date`         | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建日期               |
| `updated_at`            | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 更新日期               |


### 35. `SaasOutboundCallTasks` (SAAS平台外呼任务表)

| 字段名                 | 数据类型        | 约束/注释                                   | 中文注释             |
| ---------------------- | --------------- | ------------------------------------------- | -------------------- |
| `id`                   | VARCHAR(255)    | PK (主键)                                   | 任务ID               |
| `name`                 | VARCHAR(255)    | NOT NULL                                    | 任务名称             |
| `enterprise_id`        | VARCHAR(255)    | FK to `SaasEnterprises(id)`, NULLABLE       | 所属企业 (若特定于企业)|
| `creating_doctor_id`   | VARCHAR(255)    | FK to `Users(id)`, NULLABLE                 | 创建医生ID (若医生端创建)|
| `creating_saas_admin_id`| VARCHAR(255)   | FK to `Users(id)`, NULLABLE                 | 创建SAAS管理员ID (若平台创建)|
| `target_type`          | VARCHAR(50)     | NOT NULL, CHECK (`target_type` IN ('individual_patient', 'patient_group', 'custom_list', 'employee_group')) | 目标类型             |
| `target_patient_id`    | VARCHAR(255)    | FK to `Users(id)`, NULLABLE                 | 目标病人ID           |
| `target_group_id`      | VARCHAR(255)    | FK to `OutboundCallGroups(id)`, NULLABLE    | 目标组ID             |
| `target_custom_list_details` | TEXT      | NULLABLE                                    | 自定义列表详情       |
| `target_description`   | VARCHAR(255)    | NULLABLE                                    | 目标描述 (冗余, 便于查询)|
| `status`               | VARCHAR(50)     | NOT NULL, CHECK (`status` IN ('pending_schedule', 'scheduled', 'in_progress', 'completed', 'failed', 'cancelled')) | 任务状态             |
| `creation_date`        | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建日期             |
| `scheduled_time`       | TIMESTAMP WITH TIME ZONE | NULLABLE                               | 计划执行时间         |
| `call_content_summary` | TEXT            | NULLABLE                                    | 外呼内容摘要         |
| `sop_service_id`       | VARCHAR(255)    | FK to `SaasSopServices(id)` ON DELETE SET NULL, NULLABLE | (外键) 关联SOP服务ID |
| `assigned_to_employee_id` | VARCHAR(255) | FK to `Users(id)` ON DELETE SET NULL, NULLABLE | (外键) 分配执行员工ID|
| `call_count_total`     | INT             | DEFAULT 0                                   | 总呼叫数             |
| `call_count_success`   | INT             | DEFAULT 0                                   | 成功呼叫数           |
| `completion_status`    | VARCHAR(50)     | NULLABLE, CHECK (`completion_status` IN ('success_all', 'partial_success', 'failed_all', 'not_applicable')) | 整体完成状态       |
| `notes`                | TEXT            | NULLABLE                                    | 任务备注             |

### 36. `SaasApiKeys` (SAAS API密钥表)

| 字段名                  | 数据类型        | 约束/注释                                   | 中文注释               |
| ----------------------- | --------------- | ------------------------------------------- | ---------------------- |
| `id`                    | VARCHAR(255)    | PK (主键)                                   | 密钥ID                 |
| `saas_enterprise_id`    | VARCHAR(255)    | FK to `SaasEnterprises(id)` ON DELETE CASCADE, NULLABLE | (外键) 关联企业ID (可选) |
| `key_value_hash`        | VARCHAR(255)    | NOT NULL, UNIQUE (哈希存储)                 | 哈希后的API密钥值      |
| `key_prefix`            | VARCHAR(10)     | NOT NULL, UNIQUE                            | 密钥前缀 (用于识别)    |
| `description`           | VARCHAR(255)    | NULLABLE                                    | 密钥描述               |
| `status`                | VARCHAR(20)     | DEFAULT 'active', CHECK (`status` IN ('active', 'revoked')) | 状态                   |
| `rate_limit_per_minute` | INT             | NULLABLE                                    | 每分钟请求限制         |
| `permissions_json`      | JSONB           | NOT NULL (此密钥拥有的权限列表JSON)          | 权限列表               |
| `created_at`            | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP     | 创建时间               |
| `expires_at`            | TIMESTAMP WITH TIME ZONE | NULLABLE                                | 过期时间               |

### 37. `SaasSystemSettings` (SAAS平台系统设置表)
存储平台级配置，如默认AI模型参数等。

| 字段名            | 数据类型     | 约束/注释                                   | 中文注释     |
| ----------------- | ------------ | ------------------------------------------- | ------------ |
| `setting_key`     | VARCHAR(100) | PK (主键)                                   | 设置键       |
| `setting_value`   | TEXT         | NOT NULL                                    | 设置值       |
| `description`     | VARCHAR(255) | NULLABLE                                    | 设置描述     |
| `last_updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP     | 最后更新时间 |

### 38. `SaasLlmSettings` (SAAS平台大语言模型设置表)
存储核心LLM的配置信息。

| 字段名        | 数据类型     | 约束/注释             | 中文注释     |
| ------------- | ------------ | --------------------- | ------------ |
| `id`          | VARCHAR(255) | PK (主键), DEFAULT 'primary_llm_config' | 设置ID (如 'primary_llm_config') |
| `api_key`     | VARCHAR(512) | NOT NULL (建议加密存储) | API密钥      |
| `api_endpoint`| VARCHAR(255) | NOT NULL              | API端点URL   |
| `model_name`  | VARCHAR(100) | NOT NULL              | 模型名称     |
| `updated_at`  | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 更新时间     |

### 39. `OutboundCallGroups` (外呼组表 - SAAS/医生端通用)

| 字段名                 | 数据类型        | 约束/注释                                   | 中文注释           |
| ---------------------- | --------------- | ------------------------------------------- | ------------------ |
| `id`                   | VARCHAR(255)    | PK (主键)                                   | 组ID               |
| `saas_enterprise_id`   | VARCHAR(255)    | FK to `SaasEnterprises(id)` ON DELETE CASCADE, NOT NULL | (外键) 所属企业ID   |
| `name`                 | VARCHAR(255)    | NOT NULL                                    | 组名称             |
| `description`          | TEXT            | NULLABLE                                    | 组描述             |
| `created_by_user_id`   | VARCHAR(255)    | FK to `Users(id)` ON DELETE SET NULL, NOT NULL | (外键) 创建者用户ID |
| `creation_date`        | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 创建日期           |
| `member_count`         | INT             | DEFAULT 0                                   | 成员数量           |

### 40. `OutboundCallGroupMembers` (外呼组成员表 - SAAS/医生端通用)

| 字段名                 | 数据类型        | 约束/注释                                   | 中文注释         |
| ---------------------- | --------------- | ------------------------------------------- | ---------------- |
| `group_id`             | VARCHAR(255)    | PK, FK to `OutboundCallGroups(id)` ON DELETE CASCADE | (外键) 外呼组ID   |
| `patient_user_id`      | VARCHAR(255)    | PK, FK to `Users(id)` ON DELETE CASCADE       | (外键) 病人用户ID |
| `added_at`             | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 添加时间         |

### 41. `SaasScheduledTasks` (SAAS平台定时任务表)

| 字段名                   | 数据类型        | 约束/注释                                   | 中文注释           |
| ------------------------ | --------------- | ------------------------------------------- | ------------------ |
| `id`                     | VARCHAR(255)    | PK (主键)                                   | 任务ID             |
| `name`                   | VARCHAR(255)    | NOT NULL, UNIQUE                            | 任务名称           |
| `type`                   | VARCHAR(50)     | NOT NULL, CHECK (`type` IN ('data_backup', 'report_generation', 'notification_push', 'system_cleanup', 'external_sync')) | 任务类型           |
| `cron_expression`        | VARCHAR(100)    | NOT NULL                                    | CRON表达式         |
| `status`                 | VARCHAR(20)     | NOT NULL, CHECK (`status` IN ('enabled', 'disabled', 'running', 'error')) | 状态               |
| `last_run_at`            | TIMESTAMP WITH TIME ZONE | NULLABLE                               | 上次运行时间       |
| `next_run_at`            | TIMESTAMP WITH TIME ZONE | NULLABLE                               | 下次计划运行时间   |
| `last_run_status`        | VARCHAR(50)     | NULLABLE                                    | 上次运行结果       |
| `description`            | TEXT            | NULLABLE                                    | 任务描述           |
| `job_handler_identifier` | VARCHAR(255)    | NOT NULL                                    | 任务处理器标识符   |

### 42. `SystemLogs` (系统日志表 - 通用)

| 字段名        | 数据类型        | 约束/注释                                   | 中文注释     |
| ------------- | --------------- | ------------------------------------------- | ------------ |
| `log_id`      | SERIAL          | PK (主键, PostgreSQL自增) / BIGINT AUTO_INCREMENT (MySQL) | 日志ID       |
| `timestamp`   | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP    | 时间戳       |
| `level`       | VARCHAR(10)     | NOT NULL, CHECK (`level` IN ('INFO', 'WARN', 'ERROR', 'DEBUG', 'FATAL')) | 日志级别     |
| `source`      | VARCHAR(100)    | NULLABLE (如: patient_app, doctor_portal)   | 日志来源模块 |
| `user_id`     | VARCHAR(255)    | FK to `Users(id)` ON DELETE SET NULL, NULLABLE | (外键) 操作用户 |
| `message`     | TEXT            | NOT NULL                                    | 日志消息     |
| `context_json`| JSONB           | NULLABLE (额外上下文信息)                   | 上下文信息   |
| `ip_address`  | VARCHAR(45)     | NULLABLE                                    | IP地址       |

---
**注意:**
*   JSONB 类型特定于 PostgreSQL。对于 MySQL，可以使用 JSON 类型。如果数据库不支持 JSON，则可以考虑使用 TEXT 并存储序列化的 JSON 字符串。
*   ENUM 类型在某些数据库中可能需要用 VARCHAR 和 CHECK 约束来模拟。
*   外键的 `ON DELETE` 和 `ON UPDATE` 行为（如 `CASCADE`, `SET NULL`, `RESTRICT`）需要根据业务逻辑仔细确定。这里提供了一些常见默认值。
*   `PatientProfiles` 表中大量的 `VARCHAR(50)` 字段用于存储用户通过单选或多选框选择的文本值，这些值对应于前端定义的选项。在实际数据库设计中，可以考虑使用外键关联到专门的选项表，或者使用更严格的ENUM类型（如果选项固定且数量有限）。
*   `Users` 表中增加了一些字段以统一管理医生和SAAS平台用户的部分属性。
*   `SaasEnterprises` 中的 `assigned_resources` 改为JSONB类型，以更灵活地存储资源配额。
*   新增了 `SaasPlatformConnections` 和 `SaasCommunityGroups` 用于更细致地管理社群连接和群组。
*   `SaasCommunityMessageLogs` 用于存储聊天记录。
*   `SaasAiWorkflowApiConfigs` 用于存储Dify/Coze等工作流API配置。
*   `SaasLlmSettings` 用于存储核心大语言模型配置。

INSERT INTO TEACHERS (first_name, last_name)
VALUES ('Margot', 'DELAHAYE'),
       ('Hélène', 'THIERCELIN');


INSERT INTO USERS (first_name, last_name, admin, email, password)
VALUES ('Test', 'Test', false, 'test@test.com', '$2a$10$5ynyS3lcWDIDRpcu9WtKCO.wek809SJJTgd4Dh9.PZiQ7eOtRc4iu'),
       ('Admin', 'Admin', true, 'admin@admin.com', '$2a$10$5ynyS3lcWDIDRpcu9WtKCO.wek809SJJTgd4Dh9.PZiQ7eOtRc4iu'),
       ('Admin', 'Admin', true, 'yoga@studio.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq');

INSERT INTO SESSIONS (name, description, date, teacher_id, created_at, updated_at)
VALUES ('Vinyasa Flow', 'A dynamic and flowing yoga session that synchronizes breath with movement.', '2024-07-01 10:00:00', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Hatha Yoga', 'A traditional yoga session focusing on physical postures and breathing techniques.', '2024-07-02 14:00:00', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
       ('Yin Yoga', 'A slow-paced yoga session that targets deep connective tissues and promotes relaxation.', '2024-07-03 18:00:00', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
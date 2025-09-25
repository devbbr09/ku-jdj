-- LUMINA 시드 데이터
-- Supabase SQL Editor에서 실행하세요

-- 1. 메이크업 스타일 데이터 삽입
INSERT INTO makeup_styles (name, description, tags) VALUES
('데일리 메이크업', '일상생활에 적합한 자연스러운 메이크업', ARRAY['데일리', '자연스러운', '워크웨어']),
('글램 메이크업', '특별한 날을 위한 화려한 메이크업', ARRAY['글램', '파티', '특별한날']),
('로맨틱 메이크업', '데이트나 로맨틱한 상황에 어울리는 메이크업', ARRAY['로맨틱', '데이트', '핑크']),
('스모키 메이크업', '아이메이크업이 강조된 스모키 룩', ARRAY['스모키', '아이메이크업', '쿨톤']),
('시크 메이크업', '세련되고 모던한 메이크업', ARRAY['시크', '모던', '미니멀']),
('자연 메이크업', '거의 메이크업을 하지 않은 것처럼 보이는 자연스러운 룩', ARRAY['자연', '노메이크업', '미니멀']),
('파티 메이크업', '파티나 클럽에 어울리는 화려한 메이크업', ARRAY['파티', '클럽', '화려한']),
('웨딩 메이크업', '웨딩이나 특별한 행사에 어울리는 우아한 메이크업', ARRAY['웨딩', '우아한', '특별한날']);

-- 2. 전문가 데이터 삽입
INSERT INTO experts (name, email, phone, description, specialties, experience, rating, review_count, price) VALUES
('김민아', 'mina@lumina.com', '010-1234-5678', '10년 경력의 메이크업 아티스트. 데일리부터 글램까지 모든 스타일을 전문으로 합니다.', ARRAY['데일리', '글램', '웨딩'], 10, 4.9, 156, 50000),
('박서연', 'seoyeon@lumina.com', '010-2345-6789', '자연스러운 메이크업의 전문가. 노메이크업 룩과 데일리 메이크업을 특화합니다.', ARRAY['자연', '데일리', '노메이크업'], 8, 4.8, 134, 40000),
('이지은', 'jieun@lumina.com', '010-3456-7890', '로맨틱하고 우아한 메이크업의 전문가. 웨딩과 특별한 날 메이크업을 전문으로 합니다.', ARRAY['로맨틱', '웨딩', '특별한날'], 12, 4.9, 203, 60000),
('최유진', 'yujin@lumina.com', '010-4567-8901', '스모키와 글램 메이크업의 전문가. 파티와 클럽 메이크업을 특화합니다.', ARRAY['스모키', '글램', '파티'], 7, 4.7, 98, 45000),
('정하늘', 'haneul@lumina.com', '010-5678-9012', '시크하고 모던한 메이크업의 전문가. 비즈니스와 포멀한 상황에 어울리는 메이크업을 전문으로 합니다.', ARRAY['시크', '모던', '비즈니스'], 9, 4.8, 167, 55000);

-- 3. 테스트용 사용자 데이터 (선택사항)
INSERT INTO users (id, email, name) VALUES
('test-user-1', 'test@lumina.com', '테스트 사용자');

-- 4. 테스트용 분석 데이터 (선택사항)
INSERT INTO analyses (user_id, image_url, score, feedback, details) VALUES
('test-user-1', 'https://example.com/image1.jpg', 78, '아이 메이크업 개선이 필요합니다', '{"faceAnalysis": {"faceDetected": true, "faceCount": 1}, "imageContent": {"labels": ["face", "portrait"]}}'),
('test-user-1', 'https://example.com/image2.jpg', 85, '전반적으로 우수한 메이크업입니다', '{"faceAnalysis": {"faceDetected": true, "faceCount": 1}, "imageContent": {"labels": ["face", "portrait"]}}'),
('test-user-1', 'https://example.com/image3.jpg', 72, '베이스 메이크업 톤 조정이 필요합니다', '{"faceAnalysis": {"faceDetected": true, "faceCount": 1}, "imageContent": {"labels": ["face", "portrait"]}}');

-- 5. 테스트용 즐겨찾기 데이터 (선택사항)
INSERT INTO favorites (user_id, style_id) 
SELECT 'test-user-1', id FROM makeup_styles WHERE name IN ('데일리 메이크업', '로맨틱 메이크업');

-- 6. 테스트용 매칭 데이터 (선택사항)
INSERT INTO matchings (user_id, expert_id, message, status) VALUES
('test-user-1', (SELECT id FROM experts WHERE name = '김민아'), '스모키 메이크업 개선을 위한 상담을 요청드립니다', 'PENDING'),
('test-user-1', (SELECT id FROM experts WHERE name = '박서연'), '데일리 메이크업 상담이 승인되었습니다', 'ACCEPTED'),
('test-user-1', (SELECT id FROM experts WHERE name = '이지은'), '글램 메이크업 상담이 완료되었습니다', 'COMPLETED');

-- 완료 메시지
SELECT 'LUMINA 데이터베이스 스키마 및 시드 데이터 생성 완료!' as message;

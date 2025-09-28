import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 환경 변수 검증
if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다.');
  throw new Error('Supabase URL이 설정되지 않았습니다.');
}

if (!supabaseServiceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.');
  throw new Error('Supabase Service Role Key가 설정되지 않았습니다.');
}

// console.log('Supabase URL:', supabaseUrl);
// console.log('Service Role Key 존재:', !!supabaseServiceRoleKey);

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 });
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 5MB를 초과할 수 없습니다.' }, { status: 400 });
    }

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 고유한 파일명 생성
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}`;

    console.log('Supabase Storage 업로드 시작:', fileName);

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`analysis/${fileName}`, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase 업로드 오류:', error);
      return NextResponse.json({ error: '파일 업로드에 실패했습니다: ' + error.message }, { status: 500 });
    }

    console.log('Supabase Storage 업로드 성공:', data);

    // 공개 URL 생성
    const { data: publicData } = supabase.storage
      .from('images')
      .getPublicUrl(`analysis/${fileName}`);

    console.log('공개 URL 생성:', publicData.publicUrl);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl
    });

  } catch (error) {
    console.error('업로드 오류:', error);
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

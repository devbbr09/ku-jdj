# ku-jdj

# 작업 사항 깃 업로드 규칙
- git branch 현재 branch 확인
- main인 경우, git pull (최신 상태 유지)
- (main에서) git checkout -b {브랜치명} e.g. git checkout -b "0922-기능추가"
- 이때 git branch -> 생성한 브랜치로 이동

생성한 브랜치에서 로컬에서 작성후 저장,
- git add .
- git commit -m "어떤 기능 업데이트"
- git push origin {브랜치명} e.g. git push origin 0922-기능추가

# ============================================================================
# [인공지능 기초 수행평가] 덕-체크 (Duck-Check) 로컬 웹 애플리케이션 서버
# 개발자: 김가은 (20104)
# ============================================================================

import http.server
import socketserver
import webbrowser
import os
import sys
import csv
import json

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class DuckCheckHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # 콘솔에 접속 로그 출력
        print(f"[Duck-Check Server] {self.address_string()} - {format % args}")

def analyze_scraped_csv(csv_path):
    """
    수행평가 폴더 내 Thunderbit 스크래핑 CSV 데이터를 로드하여 기초 통계를 분석하는 함수
    """
    if not os.path.exists(csv_path):
        print(f"[경고] CSV 파일을 찾을 수 없습니다: {csv_path}")
        return

    print("\n" + "="*60)
    print("📊 [네이버 플러스 스토어 스크래핑 원천 데이터 분석 요약]")
    print("="*60)

    items = []
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                price = int(row.get('가격 (KRW)', 0) or 0)
                ship = int(row.get('배송비 (KRW)', 0) or 0)
                items.append({
                    'title': row.get('상품명', ''),
                    'price': price,
                    'shipping': ship,
                    'real_price': price + ship,
                    'brand': row.get('브랜드', '')
                })
            except ValueError:
                continue

    if items:
        total_count = len(items)
        prices = [it['real_price'] for it in items]
        avg_price = sum(prices) / total_count
        min_item = min(items, key=lambda x: x['real_price'])
        max_item = max(items, key=lambda x: x['real_price'])

        print(f"• 수집된 피규어 상품 수: {total_count}개")
        print(f"• 평균 실구매가 (배송비 포함): {int(avg_price):,}원")
        print(f"• 최저가 상품: [{min_item['title']}] - {min_item['real_price']:,}원")
        print(f"• 최고가 상품: [{max_item['title']}] - {max_item['real_price']:,}원")
        print("="*60 + "\n")

def main():
    os.chdir(DIRECTORY)
    csv_file = os.path.join(DIRECTORY, "Thunderbit_e6e8da_20261113_062052.csv")
    analyze_scraped_csv(csv_file)

    url = f"http://localhost:{PORT}/index.html"
    print(f"🚀 덕-체크 (Duck-Check) 웹 서버 시작!")
    print(f"🌐 브라우저 접속 주소: {url}")
    print("💡 서버를 종료하려면 콘솔 창에서 Ctrl+C 를 누르세요.")

    # 기본 웹 브라우저 자동 실행
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"브라우저 자동 열기 실패 (직접 위 URL로 접속하세요): {e}")

    with socketserver.TCPServer(("", PORT), DuckCheckHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[Duck-Check Server] 서버를 안전하게 종료합니다.")
            httpd.server_close()

if __name__ == "__main__":
    main()

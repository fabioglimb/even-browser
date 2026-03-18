import type { AppLanguage } from '../types'

const translations: Record<string, Record<AppLanguage, string>> = {
  // ── App ──
  'app.subtitle': { en: 'Browse the web on your G2 glasses', it: 'Naviga il web sui tuoi occhiali G2', es: 'Navega la web en tus gafas G2', fr: 'Naviguez sur vos lunettes G2', de: 'Browsen Sie auf Ihrer G2-Brille', pt: 'Navegue na web nos seus oculos G2', ja: 'G2グラスでウェブを閲覧', zh: '在G2眼镜上浏览网页', ko: 'G2 글래스로 웹 탐색' },

  // ── Home ──
  'home.quickLinks': { en: 'Quick Links', it: 'Link Rapidi', es: 'Enlaces Rapidos', fr: 'Liens Rapides', de: 'Schnelllinks', pt: 'Links Rapidos', ja: 'クイックリンク', zh: '快速链接', ko: '빠른 링크' },
  'home.bookmarks': { en: 'Bookmarks', it: 'Segnalibri', es: 'Marcadores', fr: 'Signets', de: 'Lesezeichen', pt: 'Favoritos', ja: 'ブックマーク', zh: '书签', ko: '북마크' },
  'home.recent': { en: 'Recent', it: 'Recenti', es: 'Recientes', fr: 'Recents', de: 'Zuletzt', pt: 'Recentes', ja: '最近', zh: '最近', ko: '최근' },

  // ── URL Bar ──
  'url.placeholder': { en: 'Enter URL (e.g. wikipedia.org)', it: 'Inserisci URL (es. wikipedia.org)', es: 'Ingresa URL (ej. wikipedia.org)', fr: 'Entrez URL (ex. wikipedia.org)', de: 'URL eingeben (z.B. wikipedia.org)', pt: 'Digite URL (ex. wikipedia.org)', ja: 'URLを入力 (例: wikipedia.org)', zh: '输入URL (如 wikipedia.org)', ko: 'URL 입력 (예: wikipedia.org)' },
  'url.paste': { en: 'Paste', it: 'Incolla', es: 'Pegar', fr: 'Coller', de: 'Einfugen', pt: 'Colar', ja: '貼付', zh: '粘贴', ko: '붙여넣기' },
  'url.go': { en: 'Go', it: 'Vai', es: 'Ir', fr: 'Aller', de: 'Los', pt: 'Ir', ja: '移動', zh: '前往', ko: '이동' },
  'url.loading': { en: 'Loading...', it: 'Caricamento...', es: 'Cargando...', fr: 'Chargement...', de: 'Laden...', pt: 'Carregando...', ja: '読込中...', zh: '加载中...', ko: '로딩...' },

  // ── Page View ──
  'page.back': { en: 'Back', it: 'Indietro', es: 'Atras', fr: 'Retour', de: 'Zuruck', pt: 'Voltar', ja: '戻る', zh: '返回', ko: '뒤로' },
  'page.save': { en: 'Save', it: 'Salva', es: 'Guardar', fr: 'Sauver', de: 'Speichern', pt: 'Salvar', ja: '保存', zh: '保存', ko: '저장' },
  'page.saved': { en: 'Saved', it: 'Salvato', es: 'Guardado', fr: 'Sauve', de: 'Gespeichert', pt: 'Salvo', ja: '保存済', zh: '已保存', ko: '저장됨' },
  'page.links': { en: 'links', it: 'link', es: 'enlaces', fr: 'liens', de: 'Links', pt: 'links', ja: 'リンク', zh: '链接', ko: '링크' },
  'page.lines': { en: 'lines', it: 'righe', es: 'lineas', fr: 'lignes', de: 'Zeilen', pt: 'linhas', ja: '行', zh: '行', ko: '줄' },
  'page.linksTitle': { en: 'Links', it: 'Link', es: 'Enlaces', fr: 'Liens', de: 'Links', pt: 'Links', ja: 'リンク', zh: '链接', ko: '링크' },
  'page.noLinks': { en: 'No links found on this page.', it: 'Nessun link trovato in questa pagina.', es: 'No se encontraron enlaces.', fr: 'Aucun lien trouve.', de: 'Keine Links gefunden.', pt: 'Nenhum link encontrado.', ja: 'リンクが見つかりません。', zh: '未找到链接。', ko: '링크를 찾을 수 없습니다.' },
  'page.failedToLoad': { en: 'Failed to load page', it: 'Impossibile caricare la pagina', es: 'Error al cargar la pagina', fr: 'Echec du chargement', de: 'Seite konnte nicht geladen werden', pt: 'Falha ao carregar a pagina', ja: 'ページの読み込みに失敗', zh: '页面加载失败', ko: '페이지 로드 실패' },
  'page.retry': { en: 'Retry', it: 'Riprova', es: 'Reintentar', fr: 'Reessayer', de: 'Erneut', pt: 'Tentar novamente', ja: '再試行', zh: '重试', ko: '재시도' },
  'page.goBack': { en: 'Go Back', it: 'Torna Indietro', es: 'Volver', fr: 'Retour', de: 'Zuruck', pt: 'Voltar', ja: '戻る', zh: '返回', ko: '뒤로가기' },
  'page.cancel': { en: 'Cancel', it: 'Annulla', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', pt: 'Cancelar', ja: 'キャンセル', zh: '取消', ko: '취소' },
  'page.remove': { en: 'Remove', it: 'Rimuovi', es: 'Eliminar', fr: 'Supprimer', de: 'Entfernen', pt: 'Remover', ja: '削除', zh: '移除', ko: '제거' },

  // ── Settings ──
  'settings.title': { en: 'Settings', it: 'Impostazioni', es: 'Ajustes', fr: 'Parametres', de: 'Einstellungen', pt: 'Configuracoes', ja: '設定', zh: '设置', ko: '설정' },
  'settings.display': { en: 'Display', it: 'Visualizzazione', es: 'Pantalla', fr: 'Affichage', de: 'Anzeige', pt: 'Exibicao', ja: '表示', zh: '显示', ko: '디스플레이' },
  'settings.readMode': { en: 'Read mode', it: 'Modalita lettura', es: 'Modo lectura', fr: 'Mode lecture', de: 'Lesemodus', pt: 'Modo leitura', ja: '読取モード', zh: '阅读模式', ko: '읽기 모드' },
  'settings.scroll': { en: 'Scroll', it: 'Scorrimento', es: 'Desplazar', fr: 'Defiler', de: 'Scrollen', pt: 'Rolar', ja: 'スクロール', zh: '滚动', ko: '스크롤' },
  'settings.page': { en: 'Page', it: 'Pagina', es: 'Pagina', fr: 'Page', de: 'Seite', pt: 'Pagina', ja: 'ページ', zh: '翻页', ko: '페이지' },
  'settings.scrollDesc': { en: 'Scroll line by line through content', it: 'Scorri riga per riga', es: 'Desplazar linea por linea', fr: 'Defiler ligne par ligne', de: 'Zeile fur Zeile scrollen', pt: 'Rolar linha por linha', ja: '1行ずつスクロール', zh: '逐行滚动', ko: '한 줄씩 스크롤' },
  'settings.pageDesc': { en: 'Flip through fixed pages with page indicator', it: 'Sfoglia pagine fisse con indicatore', es: 'Pasar paginas fijas con indicador', fr: 'Feuilleter les pages avec indicateur', de: 'Durch feste Seiten blattern', pt: 'Folhear paginas fixas com indicador', ja: 'ページめくり（ページ番号付き）', zh: '固定分页翻阅', ko: '고정 페이지 넘기기' },
  'settings.linesPerPage': { en: 'Lines per page', it: 'Righe per pagina', es: 'Lineas por pagina', fr: 'Lignes par page', de: 'Zeilen pro Seite', pt: 'Linhas por pagina', ja: 'ページあたりの行数', zh: '每页行数', ko: '페이지당 줄 수' },
  'settings.showPageNumbers': { en: 'Show page numbers', it: 'Mostra numeri pagina', es: 'Mostrar numeros de pagina', fr: 'Afficher numeros de page', de: 'Seitenzahlen anzeigen', pt: 'Mostrar numeros de pagina', ja: 'ページ番号を表示', zh: '显示页码', ko: '페이지 번호 표시' },
  'settings.language': { en: 'Language', it: 'Lingua', es: 'Idioma', fr: 'Langue', de: 'Sprache', pt: 'Idioma', ja: '言語', zh: '语言', ko: '언어' },
  'settings.data': { en: 'Data', it: 'Dati', es: 'Datos', fr: 'Donnees', de: 'Daten', pt: 'Dados', ja: 'データ', zh: '数据', ko: '데이터' },
  'settings.bookmarksSaved': { en: 'saved', it: 'salvati', es: 'guardados', fr: 'sauves', de: 'gespeichert', pt: 'salvos', ja: '保存済', zh: '已保存', ko: '저장됨' },
  'settings.clearHistory': { en: 'Clear Browsing History', it: 'Cancella Cronologia', es: 'Borrar Historial', fr: 'Effacer l\'historique', de: 'Verlauf loschen', pt: 'Limpar Historico', ja: '閲覧履歴を消去', zh: '清除浏览记录', ko: '검색 기록 삭제' },
  'settings.about': { en: 'About', it: 'Info', es: 'Acerca de', fr: 'A propos', de: 'Info', pt: 'Sobre', ja: '情報', zh: '关于', ko: '정보' },
  'settings.aboutText': { en: 'Web browser for Even Realities G2 smart glasses', it: 'Browser web per occhiali smart Even Realities G2', es: 'Navegador web para gafas inteligentes Even Realities G2', fr: 'Navigateur web pour lunettes Even Realities G2', de: 'Webbrowser fur Even Realities G2 Smartbrille', pt: 'Navegador web para oculos inteligentes Even Realities G2', ja: 'Even Realities G2スマートグラス用ウェブブラウザ', zh: 'Even Realities G2智能眼镜网页浏览器', ko: 'Even Realities G2 스마트 글래스용 웹 브라우저' },

  // ── Glass screens ──
  'glass.waiting': { en: 'Enter a URL on your phone', it: 'Inserisci un URL sul telefono', es: 'Ingresa una URL en tu telefono', fr: 'Entrez une URL sur votre telephone', de: 'Geben Sie eine URL auf Ihrem Handy ein', pt: 'Digite uma URL no seu celular', ja: '電話でURLを入力してください', zh: '在手机上输入URL', ko: '휴대폰에서 URL을 입력하세요' },
  'glass.waitingSub': { en: 'to start browsing.', it: 'per iniziare a navigare.', es: 'para empezar a navegar.', fr: 'pour commencer.', de: 'um zu starten.', pt: 'para comecar a navegar.', ja: '閲覧を開始します。', zh: '开始浏览。', ko: '탐색을 시작합니다.' },
  'glass.waitingStatus': { en: 'Waiting...', it: 'In attesa...', es: 'Esperando...', fr: 'En attente...', de: 'Warten...', pt: 'Aguardando...', ja: '待機中...', zh: '等待中...', ko: '대기중...' },
  'glass.loading': { en: 'Loading...', it: 'Caricamento...', es: 'Cargando...', fr: 'Chargement...', de: 'Laden...', pt: 'Carregando...', ja: '読込中...', zh: '加载中...', ko: '로딩...' },
  'glass.cancel': { en: 'Cancel', it: 'Annulla', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', pt: 'Cancelar', ja: 'キャンセル', zh: '取消', ko: '취소' },
  'glass.read': { en: 'Read', it: 'Leggi', es: 'Leer', fr: 'Lire', de: 'Lesen', pt: 'Ler', ja: '読む', zh: '阅读', ko: '읽기' },
  'glass.links': { en: 'Links', it: 'Link', es: 'Enlaces', fr: 'Liens', de: 'Links', pt: 'Links', ja: 'リンク', zh: '链接', ko: '링크' },
  'glass.back': { en: 'Back', it: 'Indietro', es: 'Atras', fr: 'Retour', de: 'Zuruck', pt: 'Voltar', ja: '戻る', zh: '返回', ko: '뒤로' },
  'glass.retry': { en: 'Retry', it: 'Riprova', es: 'Reintentar', fr: 'Reessayer', de: 'Erneut', pt: 'Tentar', ja: '再試行', zh: '重试', ko: '재시도' },
  'glass.noLinks': { en: 'No links found on this page.', it: 'Nessun link trovato.', es: 'No se encontraron enlaces.', fr: 'Aucun lien trouve.', de: 'Keine Links gefunden.', pt: 'Nenhum link encontrado.', ja: 'リンクなし', zh: '未找到链接', ko: '링크 없음' },
  'glass.failedToLoad': { en: 'Failed to load page:', it: 'Impossibile caricare:', es: 'Error al cargar:', fr: 'Echec du chargement:', de: 'Laden fehlgeschlagen:', pt: 'Falha ao carregar:', ja: '読み込み失敗:', zh: '加载失败:', ko: '로드 실패:' },
}

export type { AppLanguage }

export function t(key: string, lang: AppLanguage): string {
  const entry = translations[key]
  if (!entry) return key
  return entry[lang] ?? entry.en ?? key
}

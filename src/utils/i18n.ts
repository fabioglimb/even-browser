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

  // ── Page View (direct mode) ──
  'page.directChecking': { en: 'Checking direct mode...', it: 'Controllo modalita diretta...', es: 'Comprobando modo directo...', fr: 'Verification du mode direct...', de: 'Direktmodus wird gepruft...', pt: 'Verificando modo direto...', ja: 'ダイレクトモードを確認中...', zh: '正在检查直接模式...', ko: '직접 모드 확인 중...' },
  'page.directOpened': { en: 'Site opened in a new tab.', it: 'Sito aperto in una nuova scheda.', es: 'Sitio abierto en una nueva pestaña.', fr: 'Site ouvert dans un nouvel onglet.', de: 'Seite in neuem Tab geöffnet.', pt: 'Site aberto em uma nova aba.', ja: '新しいタブでサイトを開きました。', zh: '已在新标签页中打开网站。', ko: '새 탭에서 사이트가 열렸습니다.' },
  'page.directFallbackTitle': { en: 'This page cannot be embedded here', it: 'Questa pagina non puo essere incorporata qui', es: 'Esta pagina no se puede incrustar aqui', fr: 'Cette page ne peut pas etre integree ici', de: 'Diese Seite kann hier nicht eingebettet werden', pt: 'Esta pagina nao pode ser incorporada aqui', ja: 'このページはここに埋め込めません', zh: '此页面无法在此处嵌入', ko: '이 페이지는 여기에 임베드할 수 없습니다' },
  'page.directBlocked': { en: 'This site blocks embedded viewing, so it was opened separately.', it: 'Questo sito blocca la visualizzazione incorporata, quindi e stato aperto separatamente.', es: 'Este sitio bloquea la vista incrustada, por lo que se abrio por separado.', fr: 'Ce site bloque l\'affichage integre, il a donc ete ouvert separement.', de: 'Diese Seite blockiert die eingebettete Ansicht und wurde separat geoffnet.', pt: 'Este site bloqueia a visualizacao incorporada, entao foi aberto separadamente.', ja: 'このサイトは埋め込み表示をブロックしているため、別で開きました。', zh: '该站点阻止嵌入显示，因此已单独打开。', ko: '이 사이트는 임베드 보기를 차단하므로 별도로 열었습니다.' },
  'page.directNotHtml': { en: 'This URL does not return an embeddable web page, so it was opened separately.', it: 'Questo URL non restituisce una pagina incorporabile, quindi e stato aperto separatamente.', es: 'Esta URL no devuelve una pagina incrustable, por lo que se abrio por separado.', fr: 'Cette URL ne renvoie pas une page integrable, elle a donc ete ouverte separement.', de: 'Diese URL liefert keine einbettbare Webseite und wurde separat geoffnet.', pt: 'Esta URL nao retorna uma pagina incorporavel, entao foi aberta separadamente.', ja: 'このURLは埋め込み可能なページを返さないため、別で開きました。', zh: '该URL未返回可嵌入页面，因此已单独打开。', ko: '이 URL은 임베드 가능한 페이지를 반환하지 않아 별도로 열었습니다.' },
  'page.directMayFail': { en: 'This site may not load correctly in direct mode.', it: 'Questo sito potrebbe non caricarsi correttamente in modalita diretta.', es: 'Es posible que este sitio no cargue correctamente en modo directo.', fr: 'Ce site peut ne pas se charger correctement en mode direct.', de: 'Diese Seite wird im Direktmodus moglicherweise nicht korrekt geladen.', pt: 'Este site pode nao carregar corretamente no modo direto.', ja: 'このサイトはダイレクトモードで正しく読み込まれない可能性があります。', zh: '该站点在直接模式下可能无法正确加载。', ko: '이 사이트는 직접 모드에서 올바르게 로드되지 않을 수 있습니다.' },
  'page.directHint': { en: 'Login or interact there, then come back and disable direct mode to read the content.', it: 'Accedi o interagisci lì, poi torna indietro e disattiva la modalità diretta per leggere il contenuto.', es: 'Inicia sesión o interactúa allí, luego vuelve y desactiva el modo directo para leer el contenido.', fr: 'Connectez-vous ou interagissez là-bas, puis revenez et désactivez le mode direct pour lire le contenu.', de: 'Melden Sie sich dort an, dann kommen Sie zurück und deaktivieren Sie den Direktmodus, um den Inhalt zu lesen.', pt: 'Faça login ou interaja lá, depois volte e desative o modo direto para ler o conteúdo.', ja: 'そちらでログインまたは操作し、戻ってダイレクトモードを無効にしてコンテンツを読んでください。', zh: '在那里登录或交互，然后返回并禁用直接模式以阅读内容。', ko: '그곳에서 로그인하거나 상호작용한 후 돌아와서 직접 모드를 비활성화하여 콘텐츠를 읽으세요.' },
  'page.openAgain': { en: 'Open again', it: 'Apri di nuovo', es: 'Abrir de nuevo', fr: 'Rouvrir', de: 'Erneut öffnen', pt: 'Abrir novamente', ja: '再度開く', zh: '再次打开', ko: '다시 열기' },
  'page.openLivePage': { en: 'Open live page', it: 'Apri pagina live', es: 'Abrir pagina real', fr: 'Ouvrir la page reelle', de: 'Live-Seite öffnen', pt: 'Abrir pagina real', ja: '実際のページを開く', zh: '打开真实页面', ko: '실제 페이지 열기' },
  'page.reloadAsText': { en: 'Reload as text', it: 'Ricarica come testo', es: 'Recargar como texto', fr: 'Recharger en texte', de: 'Als Text neu laden', pt: 'Recarregar como texto', ja: 'テキストとして再読み込み', zh: '以文本重新加载', ko: '텍스트로 다시 로드' },
  'page.browse': { en: 'Browse', it: 'Naviga', es: 'Navegar', fr: 'Naviguer', de: 'Durchsuchen', pt: 'Navegar', ja: 'ブラウズ', zh: '浏览', ko: '탐색' },

  // ── Settings (additional) ──
  'settings.fontSize': { en: 'Font Size', it: 'Dimensione testo', es: 'Tamaño de fuente', fr: 'Taille de police', de: 'Schriftgröße', pt: 'Tamanho da fonte', ja: 'フォントサイズ', zh: '字体大小', ko: '글꼴 크기' },
  'settings.fontSizeSmallDesc': { en: 'More text per line (56 chars)', it: 'Più testo per riga (56 car.)', es: 'Más texto por línea (56 car.)', fr: 'Plus de texte par ligne (56 car.)', de: 'Mehr Text pro Zeile (56 Zeichen)', pt: 'Mais texto por linha (56 car.)', ja: '1行あたりのテキスト増加（56文字）', zh: '每行更多文字（56字符）', ko: '줄당 더 많은 텍스트 (56자)' },
  'settings.fontSizeMediumDesc': { en: 'Default text density (46 chars)', it: 'Densità testo predefinita (46 car.)', es: 'Densidad de texto predeterminada (46 car.)', fr: 'Densité de texte par défaut (46 car.)', de: 'Standard-Textdichte (46 Zeichen)', pt: 'Densidade de texto padrão (46 car.)', ja: 'デフォルトのテキスト密度（46文字）', zh: '默认文字密度（46字符）', ko: '기본 텍스트 밀도 (46자)' },
  'settings.fontSizeLargeDesc': { en: 'Less text per line (36 chars)', it: 'Meno testo per riga (36 car.)', es: 'Menos texto por línea (36 car.)', fr: 'Moins de texte par ligne (36 car.)', de: 'Weniger Text pro Zeile (36 Zeichen)', pt: 'Menos texto por linha (36 car.)', ja: '1行あたりのテキスト減少（36文字）', zh: '每行更少文字（36字符）', ko: '줄당 더 적은 텍스트 (36자)' },
  'settings.fontSmall': { en: 'Small', it: 'Piccolo', es: 'Pequeño', fr: 'Petit', de: 'Klein', pt: 'Pequeno', ja: '小', zh: '小', ko: '작게' },
  'settings.fontMedium': { en: 'Medium', it: 'Medio', es: 'Mediano', fr: 'Moyen', de: 'Mittel', pt: 'Médio', ja: '中', zh: '中', ko: '보통' },
  'settings.fontLarge': { en: 'Large', it: 'Grande', es: 'Grande', fr: 'Grand', de: 'Groß', pt: 'Grande', ja: '大', zh: '大', ko: '크게' },
  'settings.onlyPageMode': { en: 'Only applies in page mode', it: 'Si applica solo in modalità pagina', es: 'Solo aplica en modo página', fr: 'S\'applique uniquement en mode page', de: 'Gilt nur im Seitenmodus', pt: 'Aplica-se apenas no modo página', ja: 'ページモードのみ適用', zh: '仅适用于翻页模式', ko: '페이지 모드에서만 적용' },
  'settings.linesPerPageDesc': { en: '{n} lines per page', it: '{n} righe per pagina', es: '{n} líneas por página', fr: '{n} lignes par page', de: '{n} Zeilen pro Seite', pt: '{n} linhas por página', ja: '1ページ{n}行', zh: '每页{n}行', ko: '페이지당 {n}줄' },
  'settings.languageDesc': { en: 'App interface language', it: 'Lingua dell\'interfaccia', es: 'Idioma de la interfaz', fr: 'Langue de l\'interface', de: 'Sprache der Oberfläche', pt: 'Idioma da interface', ja: 'アプリの表示言語', zh: '应用界面语言', ko: '앱 인터페이스 언어' },
  'settings.clearHistoryDesc': { en: 'Remove all browsing history', it: 'Rimuovi tutta la cronologia', es: 'Eliminar todo el historial', fr: 'Supprimer tout l\'historique', de: 'Gesamten Verlauf löschen', pt: 'Remover todo o histórico', ja: 'すべての閲覧履歴を削除', zh: '删除所有浏览记录', ko: '모든 검색 기록 삭제' },
  'settings.cancel': { en: 'Cancel', it: 'Annulla', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', pt: 'Cancelar', ja: 'キャンセル', zh: '取消', ko: '취소' },
  'settings.confirm': { en: 'Confirm', it: 'Conferma', es: 'Confirmar', fr: 'Confirmer', de: 'Bestätigen', pt: 'Confirmar', ja: '確認', zh: '确认', ko: '확인' },
  'settings.clear': { en: 'Clear', it: 'Cancella', es: 'Borrar', fr: 'Effacer', de: 'Löschen', pt: 'Limpar', ja: '消去', zh: '清除', ko: '삭제' },

  // ── Auth Dialog ──
  'auth.loginTo': { en: 'Login to {domain}', it: 'Accedi a {domain}', es: 'Iniciar sesión en {domain}', fr: 'Connexion à {domain}', de: 'Anmelden bei {domain}', pt: 'Entrar em {domain}', ja: '{domain}にログイン', zh: '登录{domain}', ko: '{domain}에 로그인' },
  'auth.username': { en: 'Username', it: 'Nome utente', es: 'Usuario', fr: 'Nom d\'utilisateur', de: 'Benutzername', pt: 'Usuário', ja: 'ユーザー名', zh: '用户名', ko: '사용자명' },
  'auth.password': { en: 'Password', it: 'Password', es: 'Contraseña', fr: 'Mot de passe', de: 'Passwort', pt: 'Senha', ja: 'パスワード', zh: '密码', ko: '비밀번호' },
  'auth.remember': { en: 'Remember credentials', it: 'Ricorda credenziali', es: 'Recordar credenciales', fr: 'Mémoriser les identifiants', de: 'Anmeldedaten merken', pt: 'Lembrar credenciais', ja: '認証情報を記憶', zh: '记住凭据', ko: '자격 증명 기억' },
  'auth.login': { en: 'Login', it: 'Accedi', es: 'Entrar', fr: 'Connexion', de: 'Anmelden', pt: 'Entrar', ja: 'ログイン', zh: '登录', ko: '로그인' },
  'auth.cancel': { en: 'Cancel', it: 'Annulla', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', pt: 'Cancelar', ja: 'キャンセル', zh: '取消', ko: '취소' },

  // ── Page Actions ──
  'actions.directMode': { en: 'Direct mode', it: 'Modalità diretta', es: 'Modo directo', fr: 'Mode direct', de: 'Direktmodus', pt: 'Modo direto', ja: 'ダイレクトモード', zh: '直接模式', ko: '직접 모드' },
  'actions.directModeDesc': { en: 'Load actual site for login', it: 'Carica il sito reale per accedere', es: 'Cargar sitio real para iniciar sesión', fr: 'Charger le site réel pour se connecter', de: 'Echte Seite zum Anmelden laden', pt: 'Carregar site real para login', ja: '実際のサイトを読み込んでログイン', zh: '加载实际网站以登录', ko: '로그인을 위해 실제 사이트 로드' },
  'actions.addBookmark': { en: 'Add bookmark', it: 'Aggiungi segnalibro', es: 'Añadir marcador', fr: 'Ajouter un signet', de: 'Lesezeichen hinzufügen', pt: 'Adicionar favorito', ja: 'ブックマークに追加', zh: '添加书签', ko: '북마크 추가' },
  'actions.removeBookmark': { en: 'Remove bookmark', it: 'Rimuovi segnalibro', es: 'Eliminar marcador', fr: 'Supprimer le signet', de: 'Lesezeichen entfernen', pt: 'Remover favorito', ja: 'ブックマークを削除', zh: '移除书签', ko: '북마크 제거' },
  'actions.copyUrl': { en: 'Copy URL', it: 'Copia URL', es: 'Copiar URL', fr: 'Copier l\'URL', de: 'URL kopieren', pt: 'Copiar URL', ja: 'URLをコピー', zh: '复制URL', ko: 'URL 복사' },
  'actions.copyPageText': { en: 'Copy page text', it: 'Copia testo pagina', es: 'Copiar texto de la página', fr: 'Copier le texte', de: 'Seitentext kopieren', pt: 'Copiar texto da página', ja: 'ページテキストをコピー', zh: '复制页面文字', ko: '페이지 텍스트 복사' },

  // ── Search Bar ──
  'search.placeholder': { en: 'Search in page...', it: 'Cerca nella pagina...', es: 'Buscar en la página...', fr: 'Rechercher dans la page...', de: 'Auf der Seite suchen...', pt: 'Buscar na página...', ja: 'ページ内検索...', zh: '在页面中搜索...', ko: '페이지에서 검색...' },
  'search.done': { en: 'Done', it: 'Fatto', es: 'Hecho', fr: 'Terminé', de: 'Fertig', pt: 'Pronto', ja: '完了', zh: '完成', ko: '완료' },

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
  'glass.find': { en: 'Find', it: 'Cerca', es: 'Buscar', fr: 'Chercher', de: 'Suchen', pt: 'Buscar', ja: '検索', zh: '查找', ko: '찾기' },
  'glass.findOnPhone': { en: 'Use phone to search', it: 'Usa il telefono per cercare', es: 'Usa el telefono para buscar', fr: 'Utilisez le telephone', de: 'Handy zum Suchen nutzen', pt: 'Use o celular para buscar', ja: '電話で検索してください', zh: '请用手机搜索', ko: '휴대폰으로 검색하세요' },
}

export type { AppLanguage }

export function t(key: string, lang: AppLanguage, params?: Record<string, string | number>): string {
  const entry = translations[key]
  if (!entry) return key
  let result = entry[lang] ?? entry.en ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      result = result.replace(`{${k}}`, String(v))
    }
  }
  return result
}

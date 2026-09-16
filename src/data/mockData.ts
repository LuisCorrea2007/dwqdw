import {
  TestCase,
  KnowledgeEntity,
  DatabaseTable,
  SqlQueryPattern,
  RequirementItem,
  LearnedPage,
  TestDataProfile,
  TestDataLease,
  SystemDoctorCheck,
  TelemetrySpan,
  AiDecisionLog
} from '../types';

export const INITIAL_TEST_CASES: TestCase[] = [
  {
    id: 'tc-019',
    code: 'CU-019',
    name: 'Consentimiento Multicanal',
    description: 'Verificación del flujo de consentimiento informado de paciente sin consentimiento vigente en portal web y persistencia en PostgreSQL.',
    environment: 'QA',
    status: 'RUNNING',
    lastRun: '2026-09-16 10:32:01',
    coverageRequirements: ['REQ-017', 'REQ-018'],
    channels: ['Web', 'API', 'DB'],
    preconditions: [
      'Paciente autenticado con perfil activo',
      'Consentimiento vigente pendiente (ausente en DB)',
      'Lease de datos activo para paciente reservado'
    ],
    steps: [
      {
        id: 's-1',
        name: 'Precondición: paciente sin consentimiento',
        action: 'verificar_precondicion_db',
        risk: 'non_destructive',
        status: 'COMPLETED',
        durationMs: 42,
        expected: 'DB query devuelve paciente id=415 sin registro activo',
        evidence: {
          dbQuery: {
            sql: 'SELECT id_paciente FROM clinica.consentimientos WHERE id_paciente = 415 AND estado = \'VIGENTE\' LIMIT 1;',
            before: '0 rows returned',
            after: '0 rows returned (precondition verified)',
            verified: true
          }
        }
      },
      {
        id: 's-2',
        name: 'Login de paciente',
        action: 'autenticar_portal',
        risk: 'non_destructive',
        status: 'COMPLETED',
        durationMs: 230,
        expected: 'Sesión iniciada correctamente, token JWT obtenido',
        target: { role: 'button', name: 'Ingresar' }
      },
      {
        id: 's-3',
        name: 'Mostrar modal de consentimiento',
        action: 'esperar_elemento',
        target: { role: 'dialog', name: 'Consentimiento', concept: 'modal_consentimiento' },
        expected: 'El formulario o diálogo de consentimiento debe estar visible',
        risk: 'non_destructive',
        status: 'COMPLETED',
        durationMs: 95
      },
      {
        id: 's-4',
        name: 'Aceptar consentimiento',
        action: 'click',
        target: { role: 'button', name: 'Aceptar', concept: 'accept_consent', selector: '[data-testid="consent-accept"]' },
        expected: 'Botón presionado, modal cerrado, evento emitido',
        risk: 'state_change',
        status: 'RUNNING',
        durationMs: 153
      },
      {
        id: 's-5',
        name: 'API assertion: POST /consentimiento',
        action: 'verificar_red_cdp',
        expected: 'Respuesta HTTP 200 recibida en menos de 300ms',
        risk: 'non_destructive',
        status: 'PENDING'
      },
      {
        id: 's-6',
        name: 'DB assertion: consentimiento.estado = ACEPTADO',
        action: 'verificar_db_readonly',
        expected: 'Fila actualizada en clinica.consentimientos con estado ACEPTADO',
        risk: 'non_destructive',
        status: 'PENDING'
      },
      {
        id: 's-7',
        name: 'Cross-channel: sincronización móvil/web',
        action: 'verificar_api_channel',
        expected: 'Flag sincronizado para canales digitales',
        risk: 'non_destructive',
        status: 'PENDING'
      }
    ]
  },
  {
    id: 'tc-044',
    code: 'CU-044',
    name: 'Agendamiento de Cita Médica',
    description: 'Reserva de turno en especialidad Cardiología con médico de cabecera y comprobación de cupo transaccional.',
    environment: 'QA',
    status: 'READY',
    lastRun: '2026-09-16 09:15:20',
    coverageRequirements: ['REQ-003', 'REQ-012'],
    channels: ['Web', 'API', 'DB'],
    preconditions: ['Paciente con cobertura activa', 'Médico con turnos habilitados'],
    steps: [
      { id: 's-44-1', name: 'Navegar a Citas', action: 'click', target: { role: 'link', name: 'Agendar Cita' }, risk: 'non_destructive', status: 'PENDING' },
      { id: 's-44-2', name: 'Seleccionar especialidad Cardiología', action: 'select', risk: 'non_destructive', status: 'PENDING' },
      { id: 's-44-3', name: 'Confirmar turno', action: 'click', target: { role: 'button', name: 'Confirmar' }, risk: 'state_change', status: 'PENDING' }
    ]
  },
  {
    id: 'tc-021',
    code: 'CU-021',
    name: 'Cierre de app sin responder consentimiento',
    description: 'Comportamiento ante abandono de pantalla sin aceptación ni rechazo.',
    environment: 'QA',
    status: 'FAIL',
    lastRun: '2026-09-15 16:40:11',
    coverageRequirements: ['REQ-017'],
    channels: ['Web', 'API'],
    preconditions: ['Paciente en modal de consentimiento'],
    steps: [
      { id: 's-21-1', name: 'Cerrar navegador abruptamente', action: 'cerrar_sesion', risk: 'non_destructive', status: 'COMPLETED' },
      { id: 's-21-2', name: 'Reingresar en nuevo contexto', action: 'abrir_url', risk: 'non_destructive', status: 'FAILED', expected: 'Modal debe volver a presentarse (GAP detectado: no persistía estado pendiente)' }
    ]
  },
  {
    id: 'tc-082',
    code: 'CU-082',
    name: 'Validación de Convenio y Copago',
    description: 'Cálculo determinista de deducible y validación de contrato vigente en base de datos.',
    environment: 'QA',
    status: 'PASS',
    lastRun: '2026-09-16 08:30:00',
    coverageRequirements: ['REQ-025'],
    channels: ['API', 'DB'],
    preconditions: ['Convenio vigente en tabla comercial.convenios_clientes'],
    steps: [
      { id: 's-82-1', name: 'Calcular copago vía API', action: 'post_request', risk: 'non_destructive', status: 'COMPLETED' },
      { id: 's-82-2', name: 'Assert resultado en DB', action: 'verificar_db_readonly', risk: 'non_destructive', status: 'COMPLETED' }
    ]
  }
];

export const INITIAL_ENTITIES: KnowledgeEntity[] = [
  {
    id: 'e-1',
    name: 'Paciente',
    aliases: ['paciente', 'cliente', 'afiliado', 'beneficiario', 'titular'],
    identifiers: [
      {
        relation: 'comercial.com_afiliados_x_cliente',
        column: 'codigo_cliente',
        confidence: 0.99,
        provenance: ['name_similarity', 'indexed', 'validated_literal']
      },
      {
        relation: 'clinica.consentimientos',
        column: 'id_paciente',
        confidence: 0.96,
        provenance: ['inferred_join', 'foreign_key_candidate', 'exact_overlap']
      }
    ],
    relationships: [
      {
        to: 'Convenio',
        via: [
          'comercial.com_afiliados_x_cliente.codigo_convenio',
          'comercial.com_convenios_clientes.codigo_convenio'
        ],
        kind: 'foreign_key',
        confidence: 1.0,
        auditDetails: {
          namesCompatible: true,
          dataTypesMatch: 'INTEGER = INTEGER',
          indexedOnBoth: true,
          sampledRows: 250,
          matchingCount: 250,
          fkDeclared: true
        }
      },
      {
        to: 'Consentimiento',
        via: [
          'comercial.com_afiliados_x_cliente.codigo_cliente',
          'clinica.consentimientos.id_paciente'
        ],
        kind: 'inferred',
        confidence: 0.91,
        auditDetails: {
          namesCompatible: true,
          dataTypesMatch: 'INTEGER = INTEGER',
          indexedOnBoth: true,
          sampledRows: 100,
          matchingCount: 98,
          fkDeclared: false
        }
      },
      {
        to: 'Cita',
        via: [
          'comercial.com_afiliados_x_cliente.codigo_cliente',
          'agenda.citas.codigo_cliente'
        ],
        kind: 'inferred',
        confidence: 0.84,
        auditDetails: {
          namesCompatible: true,
          dataTypesMatch: 'INTEGER = INTEGER',
          indexedOnBoth: true,
          sampledRows: 150,
          matchingCount: 142,
          fkDeclared: false
        }
      }
    ],
    verifiedPatternsCount: 18
  },
  {
    id: 'e-2',
    name: 'Convenio',
    aliases: ['convenio', 'contrato', 'aseguradora', 'plan_salud'],
    identifiers: [
      {
        relation: 'comercial.com_convenios_clientes',
        column: 'codigo_convenio',
        confidence: 1.0,
        provenance: ['primary_key', 'catalog_constraint']
      }
    ],
    relationships: [
      {
        to: 'Facturación',
        via: [
          'comercial.com_convenios_clientes.codigo_convenio',
          'facturacion.recibos.codigo_convenio'
        ],
        kind: 'foreign_key',
        confidence: 1.0,
        auditDetails: {
          namesCompatible: true,
          dataTypesMatch: 'INTEGER = INTEGER',
          indexedOnBoth: true,
          sampledRows: 300,
          matchingCount: 300,
          fkDeclared: true
        }
      }
    ],
    verifiedPatternsCount: 12
  },
  {
    id: 'e-3',
    name: 'Consentimiento',
    aliases: ['consentimiento', 'autorizacion', 'acuerdo_lopdp', 'firma_digital'],
    identifiers: [
      {
        relation: 'clinica.consentimientos',
        column: 'id_consentimiento',
        confidence: 1.0,
        provenance: ['primary_key', 'serial']
      }
    ],
    relationships: [],
    verifiedPatternsCount: 9
  },
  {
    id: 'e-4',
    name: 'Cita',
    aliases: ['cita', 'turno', 'consulta', 'agenda'],
    identifiers: [
      {
        relation: 'agenda.citas',
        column: 'id_cita',
        confidence: 1.0,
        provenance: ['primary_key']
      }
    ],
    relationships: [],
    verifiedPatternsCount: 15
  }
];

export const INITIAL_DB_TABLES: DatabaseTable[] = [
  {
    schema: 'comercial',
    name: 'com_afiliados_x_cliente',
    rowCountEstimate: 5120000,
    columns: [
      { name: 'codigo_cliente', dataType: 'INTEGER', isPk: true, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'BUSINESS_IDENTIFIER', samplingAllowed: true, externalLlmAllowed: false, distinctValuesEstimate: 5100000, comments: 'Identificador único empresarial de cliente/paciente' },
      { name: 'codigo_convenio', dataType: 'INTEGER', isPk: false, isFk: true, isNullable: false, hasIndex: true, sensitivityClass: 'INTERNAL_METADATA', samplingAllowed: true, externalLlmAllowed: true, distinctValuesEstimate: 420 },
      { name: 'es_activo', dataType: 'VARCHAR(1)', isPk: false, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'INTERNAL_METADATA', samplingAllowed: true, externalLlmAllowed: true, distinctValuesEstimate: 2, comments: 'S=Activo, N=Inactivo' },
      { name: 'fecha_desde', dataType: 'TIMESTAMP', isPk: false, isFk: false, isNullable: true, hasIndex: false, sensitivityClass: 'INTERNAL_METADATA', samplingAllowed: false, externalLlmAllowed: false },
      { name: 'nombre_completo', dataType: 'VARCHAR(255)', isPk: false, isFk: false, isNullable: true, hasIndex: false, sensitivityClass: 'PII', samplingAllowed: false, externalLlmAllowed: false, comments: 'Nombre del paciente - REGLA OWASP: Nunca exponer a LLM externo' },
      { name: 'cedula_identidad', dataType: 'VARCHAR(20)', isPk: false, isFk: false, isNullable: true, hasIndex: true, sensitivityClass: 'PII', samplingAllowed: false, externalLlmAllowed: false }
    ]
  },
  {
    schema: 'comercial',
    name: 'com_convenios_clientes',
    rowCountEstimate: 480,
    columns: [
      { name: 'codigo_convenio', dataType: 'INTEGER', isPk: true, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'BUSINESS_IDENTIFIER', samplingAllowed: true, externalLlmAllowed: false },
      { name: 'nombre_convenio', dataType: 'VARCHAR(100)', isPk: false, isFk: false, isNullable: false, hasIndex: false, sensitivityClass: 'PUBLIC_METADATA', samplingAllowed: true, externalLlmAllowed: true },
      { name: 'estado', dataType: 'VARCHAR(1)', isPk: false, isFk: false, isNullable: false, hasIndex: false, sensitivityClass: 'INTERNAL_METADATA', samplingAllowed: true, externalLlmAllowed: true, comments: 'A=Activo, I=Inactivo' }
    ]
  },
  {
    schema: 'clinica',
    name: 'consentimientos',
    rowCountEstimate: 340000,
    columns: [
      { name: 'id_consentimiento', dataType: 'BIGINT', isPk: true, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'BUSINESS_IDENTIFIER', samplingAllowed: true, externalLlmAllowed: false },
      { name: 'id_paciente', dataType: 'INTEGER', isPk: false, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'BUSINESS_IDENTIFIER', samplingAllowed: true, externalLlmAllowed: false, comments: 'Equivalente a codigo_cliente (relación inferida con confianza 91%)' },
      { name: 'estado', dataType: 'VARCHAR(20)', isPk: false, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'INTERNAL_METADATA', samplingAllowed: true, externalLlmAllowed: true, comments: 'PENDIENTE, ACEPTADO, RECHAZADO, REVOCADO' },
      { name: 'version_documento', dataType: 'VARCHAR(50)', isPk: false, isFk: false, isNullable: false, hasIndex: false, sensitivityClass: 'INTERNAL_METADATA', samplingAllowed: true, externalLlmAllowed: true },
      { name: 'fecha_registro', dataType: 'TIMESTAMP', isPk: false, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'INTERNAL_METADATA', samplingAllowed: false, externalLlmAllowed: false }
    ]
  },
  {
    schema: 'agenda',
    name: 'citas',
    rowCountEstimate: 1200000,
    columns: [
      { name: 'id_cita', dataType: 'BIGINT', isPk: true, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'BUSINESS_IDENTIFIER', samplingAllowed: true, externalLlmAllowed: false },
      { name: 'codigo_cliente', dataType: 'INTEGER', isPk: false, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'BUSINESS_IDENTIFIER', samplingAllowed: true, externalLlmAllowed: false },
      { name: 'id_medico', dataType: 'INTEGER', isPk: false, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'BUSINESS_IDENTIFIER', samplingAllowed: true, externalLlmAllowed: false },
      { name: 'especialidad', dataType: 'VARCHAR(100)', isPk: false, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'PUBLIC_METADATA', samplingAllowed: true, externalLlmAllowed: true },
      { name: 'estado_cita', dataType: 'VARCHAR(20)', isPk: false, isFk: false, isNullable: false, hasIndex: true, sensitivityClass: 'INTERNAL_METADATA', samplingAllowed: true, externalLlmAllowed: true, comments: 'AGENDADA, CONFIRMADA, ATENDIDA, CANCELADA' }
    ]
  }
];

export const INITIAL_SQL_PATTERNS: SqlQueryPattern[] = [
  {
    id: 'pat-128',
    intentKey: 'paciente.convenios_activos',
    description: 'Buscar convenios activos de un paciente por identificador validado',
    entitiesRequired: ['Paciente', 'Convenio'],
    normalizedAst: 'SELECT c.codigo_convenio, c.nombre_convenio FROM comercial.com_afiliados_x_cliente a JOIN comercial.com_convenios_clientes c ON c.codigo_convenio = a.codigo_convenio WHERE a.codigo_cliente = :PATIENT_ID AND a.es_activo = :ACTIVE_FLAG AND c.estado = :CONV_STATUS',
    sampleSql: 'SELECT c.codigo_convenio, c.nombre_convenio FROM comercial.com_afiliados_x_cliente a JOIN comercial.com_convenios_clientes c ON c.codigo_convenio = a.codigo_convenio WHERE a.codigo_cliente = :PATIENT_ID AND a.es_activo = \'S\' AND c.estado = \'A\';',
    confidence: 0.97,
    successCount: 312,
    failureCount: 4,
    lastVerifiedAt: '2026-09-16 10:15:00',
    confidenceBreakdown: {
      intentSimilarity: 0.35,
      schemaCompatibility: 0.25,
      historicalSuccess: 0.24,
      recency: 0.13
    }
  },
  {
    id: 'pat-145',
    intentKey: 'paciente.consentimiento_vigente',
    description: 'Comprobar si el paciente tiene consentimiento aceptado en la versión actual',
    entitiesRequired: ['Paciente', 'Consentimiento'],
    normalizedAst: 'SELECT estado, version_documento FROM clinica.consentimientos WHERE id_paciente = :PATIENT_ID ORDER BY fecha_registro DESC LIMIT 1',
    sampleSql: 'SELECT estado, version_documento FROM clinica.consentimientos WHERE id_paciente = :PATIENT_ID ORDER BY fecha_registro DESC LIMIT 1;',
    confidence: 0.94,
    successCount: 198,
    failureCount: 2,
    lastVerifiedAt: '2026-09-16 09:40:11',
    confidenceBreakdown: {
      intentSimilarity: 0.34,
      schemaCompatibility: 0.25,
      historicalSuccess: 0.22,
      recency: 0.13
    }
  }
];

export const INITIAL_REQUIREMENTS: RequirementItem[] = [
  {
    id: 'req-017',
    code: 'REQ-017',
    title: 'Persistencia de estado al cerrar aplicación sin responder',
    text: 'Si el usuario cierra la aplicación sin responder (ni aceptar ni rechazar el consentimiento), el sistema debe registrar el evento como abandono temporal y volver a solicitar el consentimiento en el siguiente inicio de sesión.',
    sourceDoc: 'Consentimiento_LOPDP_v7.pdf',
    sourceSection: 'Sección 4.3 - Casos de Abandono',
    sourcePage: 12,
    status: 'PARTIAL',
    coverageCases: [
      { caseCode: 'CU-019', outcome: 'PASS' },
      { caseCode: 'CU-021', outcome: 'FAIL' }
    ],
    channels: ['Mobile', 'Web', 'DB'],
    needsClarification: false,
    gapAnalysis: 'API persistence not directly asserted in mobile crash edge case. Necesita probe específico de estado pendiente.'
  },
  {
    id: 'req-018',
    code: 'REQ-018',
    title: 'Aceptación explícita con hash de versión',
    text: 'El consentimiento informado requiere acción positiva del usuario (click voluntario en botón Aceptar) y debe guardar timestamp, IP ofuscada y versión legal del documento aceptado.',
    sourceDoc: 'Consentimiento_LOPDP_v7.pdf',
    sourceSection: 'Sección 2.1 - Consentimiento Válido',
    sourcePage: 5,
    status: 'COVERED',
    coverageCases: [
      { caseCode: 'CU-019', outcome: 'PASS' }
    ],
    channels: ['Web', 'API', 'DB'],
    needsClarification: false
  },
  {
    id: 'req-019',
    code: 'REQ-019',
    title: 'Tiempo de revocación y gracia legal',
    text: 'El usuario podrá revocar su consentimiento en cualquier instante según artículo 14, generando un período de gracia no especificado claramente en las APIs actuales.',
    sourceDoc: 'Consentimiento_LOPDP_v7.pdf',
    sourceSection: 'Sección 5.1 - Revocatoria',
    sourcePage: 14,
    status: 'AMBIGUOUS',
    coverageCases: [],
    channels: ['Web', 'API'],
    needsClarification: true,
    clarificationNotes: 'NEEDS HUMAN CLARIFICATION: La especificación legal no define si el período de gracia es de 24 horas o inmediato antes de suspender servicios vinculados. No fabricar criterio de aceptación sin visto bueno de Data Steward.'
  }
];

export const INITIAL_TEST_DATA_PROFILES: TestDataProfile[] = [
  {
    id: 'tdp-1',
    name: 'Paciente sin consent.',
    description: 'Pacientes con usuario activo en portal que aún no han registrado ni aceptado el consentimiento de datos.',
    candidateCount: 37,
    inUseCount: 2,
    status: 'READY',
    sampleMaskedKey: 'QA-PATIENT-5A92',
    identifierColumn: 'codigo_cliente: •••415',
    entityName: 'Paciente'
  },
  {
    id: 'tdp-2',
    name: 'Convenio activo',
    description: 'Pacientes afiliados a convenios empresariales vigentes con deducible al 100%.',
    candidateCount: 421,
    inUseCount: 11,
    status: 'READY',
    sampleMaskedKey: 'QA-CONV-8821',
    identifierColumn: 'codigo_convenio: •••102',
    entityName: 'Convenio'
  },
  {
    id: 'tdp-3',
    name: 'Cobertura expirada',
    description: 'Usuarios cuya póliza de convenio cerró el mes anterior.',
    candidateCount: 83,
    inUseCount: 0,
    status: 'READY',
    sampleMaskedKey: 'QA-EXP-1140',
    identifierColumn: 'codigo_cliente: •••891',
    entityName: 'Paciente'
  },
  {
    id: 'tdp-4',
    name: 'Dependiente activo',
    description: 'Hijos o cónyuges vinculados a cuenta titular con autorización de tutor.',
    candidateCount: 52,
    inUseCount: 3,
    status: 'READY',
    sampleMaskedKey: 'QA-DEP-3904',
    identifierColumn: 'codigo_cliente: •••734',
    entityName: 'Paciente'
  }
];

export const INITIAL_TEST_DATA_LEASES: TestDataLease[] = [
  {
    id: 'lease-1821',
    entityKey: 'patient:415',
    maskedValue: 'QA-PATIENT-5A92 (•••415)',
    runId: 'RUN-1882',
    caseId: 'CU-019',
    acquiredAt: '2026-09-16 10:32:00',
    expiresAt: '2026-09-16 10:47:00 (TTL 15m)',
    status: 'ACTIVE'
  },
  {
    id: 'lease-1820',
    entityKey: 'patient:789',
    maskedValue: 'QA-PATIENT-2B14 (•••789)',
    runId: 'RUN-1881',
    caseId: 'CU-044',
    acquiredAt: '2026-09-16 10:28:10',
    expiresAt: '2026-09-16 10:43:10',
    status: 'ACTIVE'
  }
];

export const INITIAL_LEARNED_PAGES: LearnedPage[] = [
  {
    id: 'lp-1',
    name: 'Portal Pacientes - Login',
    url: 'https://qa-portal.veris.com.ec/login',
    route: '/login',
    environment: 'QA',
    allowedOrigin: 'qa-portal.veris.com.ec',
    lastLearned: '2026-09-16 09:20:00',
    version: 'v3.2.1',
    discoveredRoutesCount: 4,
    apiEndpointsCount: 3,
    crawlingPolicy: {
      maxDepth: 5,
      maxPages: 200,
      maxDurationMin: 10,
      allowedMethods: ['GET', 'HEAD'],
      ssrfSafe: true
    },
    semanticControls: [
      { id: 'c-1', concept: 'user_field', role: 'textbox', accessibleName: 'Usuario / Correo', testid: 'txt-usuario', text: '', risk: 'non_destructive' },
      { id: 'c-2', concept: 'password_field', role: 'textbox', accessibleName: 'Contraseña', testid: 'txt-password', text: '', risk: 'non_destructive' },
      { id: 'c-3', concept: 'submit_login', role: 'button', accessibleName: 'Ingresar', testid: 'btn-login', text: 'Ingresar', risk: 'non_destructive' }
    ]
  },
  {
    id: 'lp-2',
    name: 'Consentimiento Informado',
    url: 'https://qa-portal.veris.com.ec/consentimiento',
    route: '/consentimiento',
    environment: 'QA',
    allowedOrigin: 'qa-portal.veris.com.ec',
    lastLearned: '2026-09-16 09:25:00',
    version: 'v3.2.1',
    discoveredRoutesCount: 1,
    apiEndpointsCount: 2,
    crawlingPolicy: {
      maxDepth: 3,
      maxPages: 50,
      maxDurationMin: 5,
      allowedMethods: ['GET', 'HEAD'],
      ssrfSafe: true
    },
    semanticControls: [
      { id: 'c-4', concept: 'modal_dialog', role: 'dialog', accessibleName: 'Consentimiento de Tratamiento de Datos', text: 'Consentimiento', risk: 'non_destructive' },
      { id: 'c-5', concept: 'accept_consent', role: 'button', accessibleName: 'Aceptar', testid: 'consent-accept', text: 'Aceptar', risk: 'state_change' },
      { id: 'c-6', concept: 'reject_consent', role: 'button', accessibleName: 'Rechazar', testid: 'consent-reject', text: 'Rechazar', risk: 'state_change' },
      { id: 'c-7', concept: 'close_modal', role: 'button', accessibleName: 'Cerrar', testid: 'consent-close', text: 'Cerrar', risk: 'non_destructive' }
    ]
  }
];

export const INITIAL_SYSTEM_DOCTOR_CHECKS: SystemDoctorCheck[] = [
  // Core
  { id: 'd-1', category: 'Core', name: 'Python runtime compatible', description: 'Python >= 3.11 with typed environment', status: 'OK', details: 'Python 3.12.3 (x86_64-linux)' },
  { id: 'd-2', category: 'Core', name: 'Database migrations state', description: 'Alembic / SQL schema revision status', status: 'OK', details: 'All 24 revisions applied. Schema hash: f89a2e' },
  { id: 'd-3', category: 'Core', name: 'Artifact storage filesystem', description: 'Read/write quota for trace artifacts', status: 'OK', details: 'Available 84.2 GB on /var/veris/artifacts' },
  { id: 'd-4', category: 'Core', name: 'Master encryption keys (AES-GCM)', description: 'Key rotation status & local vault', status: 'OK', details: 'Active key ID: key-2026-03 (expires in 120 days)' },
  
  // Control Plane
  { id: 'd-5', category: 'Control Plane', name: 'PostgreSQL Control DB', description: 'State storage for runs, policies and cases', status: 'OK', latencyMs: 2.8, details: 'Connected (pool size: 10/20 active)' },
  { id: 'd-6', category: 'Control Plane', name: 'Redis queue broker', description: 'Job queue dispatcher & state pubsub', status: 'OK', latencyMs: 1.1, details: 'Valkey/Redis 7.2 ping OK' },
  { id: 'd-7', category: 'Control Plane', name: 'Queue workers active', description: 'Heartbeat of web, db and api workers', status: 'OK', details: '8/8 workers alive (Web: 3, DB: 2, API: 2, Intel: 1)' },
  { id: 'd-8', category: 'Control Plane', name: 'Job Scheduler daemon', description: 'Cron & lease reaper process', status: 'OK', details: 'Running, next run in 38s' },

  // Browser Engine
  { id: 'd-9', category: 'Browser', name: 'Chromium binary executable', description: 'Headless browser sandbox verification', status: 'OK', details: 'Chromium 124.0.6367.207 installed' },
  { id: 'd-10', category: 'Browser', name: 'Playwright Action Layer', description: 'Auto-waiting and locator actionability', status: 'OK', details: 'playwright-core v1.44 ready' },
  { id: 'd-11', category: 'Browser', name: 'CDP Telemetry Session', description: 'Network domain & DOM snapshot bridge', status: 'OK', details: 'CDP tip-of-tree session active on port 9222' },
  { id: 'd-12', category: 'Browser', name: 'Browser egress & sandbox policy', description: 'SSRF protection on loopback/private ranges', status: 'OK', details: 'Strict allowlist active (qa-portal.*, api-qa.*)' },

  // PostgreSQL
  { id: 'd-13', category: 'PostgreSQL', name: 'SUT Connection pool', description: 'Target system PostgreSQL pool (comercial, clinica)', status: 'OK', latencyMs: 3.4, details: 'PostgreSQL 16.2 on port 5432' },
  { id: 'd-14', category: 'PostgreSQL', name: 'SELECT read-only enforcement', description: 'PROD policy prevents any mutation queries', status: 'OK', details: 'Enforced at transaction level (SET TRANSACTION READ ONLY)' },
  { id: 'd-15', category: 'PostgreSQL', name: 'Catalog scan visibility', description: 'Access to pg_class, pg_constraint, pg_description', status: 'OK', details: '142 tables, 89 FK constraints indexed' },
  { id: 'd-16', category: 'PostgreSQL', name: 'Statement timeout gate', description: 'Prevents long-running queries from locking DB', status: 'OK', details: 'Configured: 5000ms max query time' },

  // Knowledge Plane
  { id: 'd-17', category: 'Knowledge', name: 'Semantic model sync', description: 'Entities, aliases & provenances', status: 'OK', details: '4 core entities, 48 concepts, 18 patterns' },
  { id: 'd-18', category: 'Knowledge', name: 'Schema hash consistency', description: 'Drift detection between code and catalog', status: 'OK', details: 'Catalog last synced 4 min ago' },
  { id: 'd-19', category: 'Knowledge', name: 'Sensitivity classifier rules', description: 'Deny-by-default rules for patient columns', status: 'OK', details: 'Rules active: PII, Health, Auth masked' },

  // Security
  { id: 'd-20', category: 'Security', name: 'Local Redaction Layer', description: 'Masks passwords, tokens and medical identifiers', status: 'OK', details: 'Canary test passed: 0 sensitive items logged' },
  { id: 'd-21', category: 'Security', name: 'Crawler SSRF allowlist', description: 'Blocks access to metadata/internal cloud endpoints', status: 'OK', details: '169.254.169.254 blocked, internal IPs gated' },
  { id: 'd-22', category: 'Security', name: 'External LLM Payload Policy', description: 'Ensures only redacted AST & non-PII leaves server', status: 'OK', details: 'Strict local-only for health & credentials' },

  // Observability
  { id: 'd-23', category: 'Observability', name: 'OpenTelemetry Collector', description: 'Traces and span correlation receiver', status: 'OK', latencyMs: 4.2, details: 'OTel collector listening on grpc:4317' },
  { id: 'd-24', category: 'Observability', name: 'Prometheus metrics scrape target', description: 'Metrics telemetry endpoint exporter', status: 'OK', details: 'Metrics exporter active on :9090' }
];

export const INITIAL_TELEMETRY_SPANS: TelemetrySpan[] = [
  {
    id: 'sp-1',
    timestamp: '10:32:00.950',
    traceId: 'tr-8821-f09',
    runId: 'RUN-1882',
    caseId: 'CU-019',
    stepId: 's-1',
    environment: 'QA',
    component: 'db',
    action: 'SELECT clinica.consentimientos read-only',
    durationMs: 42,
    status: 'OK',
    details: 'Precondición validada: paciente id=415 sin consentimiento previo'
  },
  {
    id: 'sp-2',
    timestamp: '10:32:01.112',
    traceId: 'tr-8821-f09',
    runId: 'RUN-1882',
    caseId: 'CU-019',
    stepId: 's-4',
    environment: 'QA',
    component: 'web',
    action: 'CLICK "Aceptar" [data-testid="consent-accept"]',
    durationMs: 47,
    status: 'OK',
    details: 'Dispatched click via Playwright locator'
  },
  {
    id: 'sp-3',
    timestamp: '10:32:01.159',
    traceId: 'tr-8821-f09',
    runId: 'RUN-1882',
    caseId: 'CU-019',
    stepId: 's-5',
    environment: 'QA',
    component: 'api',
    action: 'POST /api/v1/consentimiento (Network.requestWillBeSent)',
    durationMs: 0,
    status: 'PENDING',
    details: 'Captured by CDP session. Headers injected: X-Veris-QA-Run-ID=RUN-1882'
  },
  {
    id: 'sp-4',
    timestamp: '10:32:01.312',
    traceId: 'tr-8821-f09',
    runId: 'RUN-1882',
    caseId: 'CU-019',
    stepId: 's-5',
    environment: 'QA',
    component: 'api',
    action: 'HTTP POST /api/v1/consentimiento 200 OK (Network.responseReceived)',
    durationMs: 153,
    status: 'OK',
    details: 'Response payload HMAC:87f1... status=ACCEPTED'
  },
  {
    id: 'sp-5',
    timestamp: '10:32:01.420',
    traceId: 'tr-8821-f09',
    runId: 'RUN-1882',
    caseId: 'CU-019',
    stepId: 's-6',
    environment: 'QA',
    component: 'db',
    action: 'DB postcondition verify: clinica.consentimientos.estado',
    durationMs: 38,
    status: 'OK',
    details: 'Transition confirmed: NULL -> ACEPTADO'
  },
  {
    id: 'sp-6',
    timestamp: '10:32:01.581',
    traceId: 'tr-8821-f09',
    runId: 'RUN-1882',
    caseId: 'CU-019',
    stepId: 's-4',
    environment: 'QA',
    component: 'web',
    action: 'UI Modal cerrado ✓',
    durationMs: 22,
    status: 'OK',
    details: 'Dialog [role="dialog"] is no longer in DOM'
  }
];

export const INITIAL_AI_DECISIONS: AiDecisionLog[] = [
  {
    id: 'aid-1',
    timestamp: '10:32:00.800',
    stepName: 'Precondition Resolver',
    decision: 'Buscar paciente candidato con convenio activo y sin consentimiento',
    evidence: {
      'natural_intent': 'paciente activo, convenio vigente y sin consentimiento',
      'candidate_sql': 'SELECT codigo_cliente FROM comercial.com_afiliados_x_cliente WHERE es_activo = \'S\' AND ...',
      'validation': 'AST validado con SQLGlot, policy=READ_ONLY',
      'selected_lease': 'QA-PATIENT-5A92 (•••415)'
    },
    confidence: 0.99
  },
  {
    id: 'aid-2',
    timestamp: '10:32:01.050',
    stepName: 'Locator Selection & Self-Healing',
    decision: 'Usar botón "Aceptar" mediante selector data-testid="consent-accept"',
    evidence: {
      'role': 'button',
      'accessible_name': 'Aceptar',
      'page': 'Consentimiento',
      'old_selector': '#btnAceptar',
      'resolved_selector': '[data-testid="consent-accept"]'
    },
    confidence: 0.96,
    isSelfHealing: true,
    healingDetails: {
      oldSelector: '#btnAceptar',
      newSelector: '[data-testid="consent-accept"]',
      reason: 'old selector missing from DOM; same role/name/context found at identical hierarchy position',
      approved: false
    }
  }
];

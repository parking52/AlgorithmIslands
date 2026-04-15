import { STATIC_BOOK } from '../data/staticBook';
import { validateBookStructure, createPageMetadata, createStructuredHunts, buildReferenceGraph } from './bookStructure';

// TODO: add automated tests for the validation checklist once a test framework is available
// This should verify missing refs, invalid pages, unreachable pages, and hunt entry/exit integrity.

// Test the validation system
export function testBookValidation() {
  console.log('🧪 Testing Book Validation System...\n');

  // Test validation
  const validation = validateBookStructure(STATIC_BOOK);
  console.log('📊 Validation Results:');
  console.log(`✅ Valid: ${validation.isValid}`);
  console.log(`📝 Total issues: ${validation.errors.length}`);

  validation.errors.forEach((error, index) => {
    const icon = error.type === 'ERROR' ? '❌' : error.type === 'WARNING' ? '⚠️' : 'ℹ️';
    console.log(`${icon} ${error.code}: ${error.message}`);
  });

  console.log('\n📄 Page Metadata:');
  const pageMetadata = createPageMetadata(STATIC_BOOK);
  pageMetadata.forEach(page => {
    console.log(`  ${page.id} (${page.logicalName}): Page ${page.pageNumber}, Used by ${page.usedByHunts.length} hunts`);
  });

  console.log('\n🏴‍☠️ Structured Hunts:');
  const structuredHunts = createStructuredHunts(STATIC_BOOK);
  structuredHunts.forEach(hunt => {
    console.log(`  ${hunt.id}: ${hunt.name} (${hunt.pages.length} pages)`);
  });

  console.log('\n🔗 Reference Graph:');
  const graph = buildReferenceGraph(pageMetadata, structuredHunts);
  console.log(`  Nodes: ${graph.nodes.length}, Edges: ${graph.edges.length}`);

  return {
    validation,
    pageMetadata,
    structuredHunts,
    graph
  };
}
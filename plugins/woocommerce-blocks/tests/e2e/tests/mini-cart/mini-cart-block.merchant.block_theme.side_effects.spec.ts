/**
 * External dependencies
 */
import { test, expect } from '@woocommerce/e2e-playwright-utils';

/**
 * Internal dependencies
 */
import { blockData } from './utils';

test.describe( 'Merchant → Mini Cart', () => {
	test.describe( 'in FSE editor', () => {
		test.afterAll( async ( { templateApiUtils } ) => {
			await templateApiUtils.revertTemplate(
				'woocommerce/woocommerce//single-product'
			);
		} );

		test( 'can be inserted in FSE area', async ( {
			editorUtils,
			editor,
			admin,
		} ) => {
			await admin.visitSiteEditor( {
				postId: `woocommerce/woocommerce//single-product`,
				postType: 'wp_template',
			} );
			await editorUtils.enterEditMode();

			await editor.setContent( '' );

			await editor.insertBlock( { name: blockData.slug } );
			await expect(
				await editorUtils.getBlockByName( blockData.slug )
			).toBeVisible();
			await editor.saveSiteEditorEntities();
		} );

		test( 'can only be inserted once', async ( { editorUtils, admin } ) => {
			await admin.visitSiteEditor( {
				postId: `woocommerce/woocommerce//single-product`,
				postType: 'wp_template',
			} );
			await editorUtils.enterEditMode();
			await editorUtils.openGlobalBlockInserter();

			await editorUtils.page
				.getByLabel( 'Search for blocks and patterns' )
				.fill( blockData.slug );
			const miniCartButton = editorUtils.page.getByRole( 'option', {
				name: blockData.name,
				exact: true,
			} );

			await expect( miniCartButton ).toHaveAttribute(
				'aria-disabled',
				'true'
			);
		} );
	} );
} );
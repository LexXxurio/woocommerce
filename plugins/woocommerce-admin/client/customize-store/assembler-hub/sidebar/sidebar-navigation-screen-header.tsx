/* eslint-disable @woocommerce/dependency-group */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useCallback,
	createInterpolateElement,
	useContext,
	useEffect,
	useMemo,
} from '@wordpress/element';
import { Link } from '@woocommerce/components';
import { recordEvent } from '@woocommerce/tracks';
import { Spinner } from '@wordpress/components';
// @ts-ignore No types for this exist yet.
import { __experimentalBlockPatternsList as BlockPatternList } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { SidebarNavigationScreen } from './sidebar-navigation-screen';
import { ADMIN_URL } from '~/utils/admin-settings';
import { usePatternsByCategory } from '../hooks/use-patterns';
import { useEditorBlocks } from '../hooks/use-editor-blocks';
import { HighlightedBlockContext } from '../context/highlighted-block-context';
import { useEditorScroll } from '../hooks/use-editor-scroll';

const SUPPORTED_HEADER_PATTERNS = [
	'woocommerce-blocks/header-essential',
	'woocommerce-blocks/header-minimal',
	'woocommerce-blocks/header-large',
	'woocommerce-blocks/header-centered-menu-with-search',
];

export const SidebarNavigationScreenHeader = () => {
	useEditorScroll( {
		editorSelector: '.woocommerce-customize-store__block-editor iframe',
		scrollDirection: 'top',
	} );

	const { isLoading, patterns } = usePatternsByCategory( 'woo-commerce' );
	const [ blocks, , onChange ] = useEditorBlocks();
	const { setHighlightedBlockIndex, resetHighlightedBlockIndex } = useContext(
		HighlightedBlockContext
	);

	useEffect( () => {
		setHighlightedBlockIndex( 0 );
	}, [ setHighlightedBlockIndex ] );

	const headerPatterns = useMemo(
		() =>
			patterns
				.filter( ( pattern ) =>
					SUPPORTED_HEADER_PATTERNS.includes( pattern.name )
				)
				.sort(
					( a, b ) =>
						SUPPORTED_HEADER_PATTERNS.indexOf( a.name ) -
						SUPPORTED_HEADER_PATTERNS.indexOf( b.name )
				),
		[ patterns ]
	);

	const onClickHeaderPattern = useCallback(
		( _pattern, selectedBlocks ) => {
			onChange( [ selectedBlocks[ 0 ], ...blocks.slice( 1 ) ], {
				selection: {},
			} );
		},
		[ blocks, onChange ]
	);

	return (
		<SidebarNavigationScreen
			title={ __( 'Change your header', 'woocommerce' ) }
			onNavigateBackClick={ resetHighlightedBlockIndex }
			description={ createInterpolateElement(
				__(
					"Select a new header from the options below. Your header includes your site's navigation and will be added to every page. You can continue customizing this via the <EditorLink>Editor</EditorLink>.",
					'woocommerce'
				),
				{
					EditorLink: (
						<Link
							onClick={ () => {
								recordEvent(
									'customize_your_store_assembler_hub_editor_link_click',
									{
										source: 'header',
									}
								);
								window.open(
									`${ ADMIN_URL }site-editor.php`,
									'_blank'
								);
								return false;
							} }
							href=""
						/>
					),
				}
			) }
			content={
				<>
					<div className="edit-site-sidebar-navigation-screen-patterns__group-header">
						{ isLoading && (
							<span className="components-placeholder__preview">
								<Spinner />
							</span>
						) }

						{ ! isLoading && (
							<BlockPatternList
								shownPatterns={ headerPatterns }
								blockPatterns={ headerPatterns }
								onClickPattern={ onClickHeaderPattern }
								label={ 'Headers' }
								orientation="vertical"
								category={ 'header' }
								isDraggable={ false }
								showTitlesAsTooltip={ true }
							/>
						) }
					</div>
				</>
			}
		/>
	);
};
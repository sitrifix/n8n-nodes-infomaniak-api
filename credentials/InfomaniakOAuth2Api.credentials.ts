import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class InfomaniakOAuth2Api implements ICredentialType {
	name = 'infomaniakOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Infomaniak OAuth2 API';

	icon: Icon = { light: 'file:../icons/infomaniak.svg', dark: 'file:../icons/infomaniak.svg' };

	documentationUrl = 'https://api.infomaniak.com/doc';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://login.infomaniak.com/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://login.infomaniak.com/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'mail domain web',
			description: 'Space-separated list of scopes to request.',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}

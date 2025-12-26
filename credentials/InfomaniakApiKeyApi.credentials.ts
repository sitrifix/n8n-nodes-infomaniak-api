import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class InfomaniakApiKeyApi implements ICredentialType {
	name = 'infomaniakApiKeyApi';

	displayName = 'Infomaniak API Key';

	icon: Icon = { light: 'file:../icons/infomaniak.svg', dark: 'file:../icons/infomaniak.svg' };

	documentationUrl = 'https://api.infomaniak.com/doc';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials?.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.infomaniak.com',
			url: '/1/ping',
			method: 'GET',
		},
	};
}

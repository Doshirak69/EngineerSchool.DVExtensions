using DocsVision.WebClient.Extensibility;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using System.Resources;
using DocsVision.BusinessTrip.WebClient.Services.Interfaces;
using DocsVision.BusinessTrip.WebClient.Services;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle;
using DocsVision.Platform.ObjectModel;
using DocsVision.BusinessTrip.WebClient.CardLifeCycle;
using DocsVision.WebClientLibrary.ObjectModel.Extensibility;

namespace DocsVision.BusinessTrip.WebClient
{
    public class ServerExtension : WebClientExtension
    {
        public ServerExtension(IServiceProvider serviceProvider) : base()
        {
        }

        public override string ExtensionName => Assembly.GetAssembly(typeof(ServerExtension)).GetName().Name;

        public override Version ExtensionVersion => new Version(FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location).FileVersion);

        public override void InitializeServiceCollection(IServiceCollection services)
        {
            services.AddSingleton<IBusinessTripBackendService, BusinessTripBackendService>();

            services.Decorate<ICardLifeCycleEx>(static (original, serviceProvider) =>
            {
                var objectContext = serviceProvider.GetRequiredService<ObjectContext>();
                var backendService = serviceProvider.GetRequiredService<IBusinessTripBackendService>();
                return new BusinessTripCardLifeCycleDecorator(original, objectContext, backendService);
            });
        }
      

        protected override List<ResourceManager> GetLayoutExtensionResourceManagers()
        {
            return new List<ResourceManager>();
        }
    }
}